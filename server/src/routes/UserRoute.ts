/**
 * =============================================================================
 * UserRoute
 * =============================================================================
 * Mounted at `/api/rest/user`. Self-service account management for the
 * currently logged-in user: profile picture, profile fields, password
 * change, two-factor auth setup/enable/disable, and account deletion. All
 * routes require auth and act on the caller's own account only (id taken
 * from the session, never from params).
 */
import {Router, Request, Response} from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";
import multer from "multer";
import rateLimit from "express-rate-limit";
import {
    generateTotpSecret,
    buildOtpAuthUrl,
    generateQrCodeDataUrl,
    verifyTotpCode,
    generateBackupCodes
} from "../utils/TwoFactorAuth";

const router = Router();

// Strict limiter for the current-password check, same shape as the
// login/register limiter - without it, a stolen/short-lived session token
// could be used to brute-force the account's current password.
const passwordChangeLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5,
    message: "Too many attempts, please try again later.",
});

// Same shape, dedicated to the 2FA enable code check - a stolen session
// token shouldn't be able to brute-force a 6-digit TOTP code either.
const twoFaLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5,
    message: "Too many attempts, please try again later.",
});

// Multer setup - store in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024}, // 2MB
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: any, acceptFile: boolean) => void) => {
        // @ts-ignore
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
            return cb(new Error("Only PNG or JPG images are allowed"), false);
        }
        cb(null, true);
    }
});

/**
 * POST /user/image
 * ------------------
 * Upload/replace the current user's profile picture.
 *
 * Auth: required. Body: multipart/form-data, field `image` (PNG/JPEG, max 2MB).
 * Stored as raw bytes in `users.image` (converted to a base64 data: URL on read,
 * see `getUser()` in AppRoute.ts).
 *
 * Example request (curl): curl -X POST /api/rest/user/image -F "image=@avatar.png"
 *
 * Responses: 200 {"message": "Image uploaded successfully"} |
 *            400 {"error": "No PNG file uploaded or file too large"}.
 */
router.post("/image", requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        if (!req.file) {
            return res.status(400).json({error: "No PNG file uploaded or file too large"});
        }

        // Update user image in DB
        await client.query(`
                    UPDATE users
                    SET image = $1
                    WHERE id = $2
            `,
            [req.file.buffer, appService.getSessionUser(req)] // req.user.id comes from requireAuth
        );

        res.status(200).json({message: "Image uploaded successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

/**
 * DELETE /user/image
 * ---------------------
 * Remove the current user's profile picture (sets `users.image` to NULL).
 *
 * Auth: required.
 *
 * Response (200): {"message": "Image removed successfully"}.
 */
router.delete("/image", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        await client.query(`
                    UPDATE users
                    SET image = null
                    WHERE id = $1
            `,
            [appService.getSessionUser(req)] // req.user.id comes from requireAuth
        );

        res.status(200).json({message: "Image removed successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

/**
 * PUT /user
 * ----------
 * Update the current user's profile fields.
 *
 * Auth: required.
 * Body: { "name": "Jane Doe", "email": "jane@example.com", "language": "en", "region": "US" }
 *
 * Response (200): {"message": "User updated successfully"}.
 */
router.put("", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);
    try {
        // Body params
        const {name, email, language, region} = req.body;

        await client.query(`
                    UPDATE users
                    SET name = $1, 
                        email = $2,
                        language = $3,
                        region = $4
                    WHERE id = $5
            `,
            [name, email, language, region, userId]
        );

        res.status(200).json({message: "User updated successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

/**
 * PATCH /user/theme
 * -------------------
 * Update the current user's UI theme preference ("beige" or "library",
 * see plugins/theme.ts on the client). Applied immediately client-side for
 * instant feedback; this just persists it so it's restored on next login.
 *
 * Auth: required. Body: { "theme": "beige" | "library" }.
 * Responses: 200 {"message": "Theme updated successfully"} |
 *            400 {"error": "Invalid theme"}.
 */
router.patch("/theme", requireAuth, async (req: Request, res: Response) => {
    const {theme} = req.body;

    if (theme !== "beige" && theme !== "library") {
        return res.status(400).json({error: "Invalid theme"});
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        await pool.query(
            `UPDATE users
             SET theme = $1
             WHERE id = $2`,
            [theme, userId]
        );

        res.status(200).json({message: "Theme updated successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * PATCH /user/sidebar-rail
 * --------------------------
 * Update whether the current user's left nav collapses to icon-only "rail"
 * mode (expanding on hover) instead of staying fully expanded (see
 * AppMenu.vue on the client). Applied immediately client-side for instant
 * feedback; this just persists it so it's restored on next login.
 *
 * Auth: required. Body: { "sidebarRail": true | false }.
 * Responses: 200 {"message": "Sidebar preference updated successfully"} |
 *            400 {"error": "Invalid sidebarRail"}.
 */
router.patch("/sidebar-rail", requireAuth, async (req: Request, res: Response) => {
    const {sidebarRail} = req.body;

    if (typeof sidebarRail !== "boolean") {
        return res.status(400).json({error: "Invalid sidebarRail"});
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        await pool.query(
            `UPDATE users
             SET sidebar_rail = $1
             WHERE id = $2`,
            [sidebarRail, userId]
        );

        res.status(200).json({message: "Sidebar preference updated successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * PATCH /user/leasing
 * ----------------------
 * Update whether the current user's Loans and Customers pages (and their
 * nav items) are shown (see AppMenu.vue and Router.ts on the client). Off
 * by default - most accounts just track a personal collection and don't
 * lend books out.
 *
 * Auth: required. Body: { "leasingEnabled": true | false }.
 * Responses: 200 {"message": "Leasing preference updated successfully"} |
 *            400 {"error": "Invalid leasingEnabled"}.
 */
router.patch("/leasing", requireAuth, async (req: Request, res: Response) => {
    const {leasingEnabled} = req.body;

    if (typeof leasingEnabled !== "boolean") {
        return res.status(400).json({error: "Invalid leasingEnabled"});
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        await pool.query(
            `UPDATE users
             SET leasing_enabled = $1
             WHERE id = $2`,
            [leasingEnabled, userId]
        );

        res.status(200).json({message: "Leasing preference updated successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * DELETE /user
 * -------------
 * Permanently delete the current user's account (and, via DB foreign keys,
 * all of their books/locations/customers/etc.), then redirect to `/login`.
 *
 * Auth: required.
 */
router.delete("", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);
    try {
        await client.query(`DELETE FROM users WHERE id = $1`,
            [userId]
        );

        return res.redirect("/login"); // Redirect to login page if user is not logged in
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

/**
 * POST /user/password
 * ----------------------
 * Change the current user's password.
 *
 * Rate limited: 5 requests / 5 minutes (see `passwordChangeLimiter`), to
 * prevent using a stolen session token to brute-force the current password.
 * Auth: required.
 * Body: { "currentPassword": "OldS3cret!", "newPassword": "NewS3cret!456" }
 * (`newPassword` needs 8+ chars, an uppercase letter, a digit, a special char).
 *
 * On success, `users.token_version` is incremented (invalidating every other
 * previously issued session token for this user) and a fresh token for
 * *this* session is issued immediately, so the caller isn't logged out.
 *
 * Responses: 200 {"success": true, "message": "Password updated successfully"} |
 *            400 {"success": false, "message": "...", "missing": [...]} (weak password) |
 *            401 {"message": "Invalid current password."}.
 */
router.post("/password", requireAuth, passwordChangeLimiter, async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);
    try {
        const userQuery = "SELECT password FROM users WHERE id = $1";
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({message: "Invalid username or password."});
        }

        const user = userResult.rows[0];

        const comparePassword = await appService.comparePassword(currentPassword, user.password);
        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid current password." });
        }

        // Password rules
        const hasMinLength = newPassword.length >= 8;
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

        const errors: string[] = [];
        if (!hasMinLength) errors.push("At least 8 characters");
        if (!hasUppercase) errors.push("At least one uppercase letter");
        if (!hasNumber) errors.push("At least one number");
        if (!hasSpecialChar) errors.push("At least one special character");

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet the requirements",
                missing: errors
            });
        }

        const newHashedPassword = await appService.hashPassword(newPassword);

        // Bumping token_version invalidates every session token issued
        // before this change (stolen tokens included) - requireAuth checks
        // it on every request. RETURNING gets us the new value so we can
        // reissue a token for *this* session without logging the user out.
        const updateResult = await client.query(
            `UPDATE users SET password = $1, token_version = token_version + 1 WHERE id = $2 RETURNING token_version`,
            [newHashedPassword, userId]
        );

        const newToken = appService.createSessionToken(userId, updateResult.rows[0].token_version);
        res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appService.getSessionTime()
        });

        return res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err: any) {
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

/**
 * POST /user/security-notice/accept
 * ------------------------------------
 * Acknowledge the security-measures notice shown after login to accounts
 * flagged as a public institution (see SecurityNoticeDialog.vue and
 * GET /app/policy, which reports whether it's still pending as
 * `user.securityNoticeAccepted`).
 *
 * Auth: required. Idempotent - accepting more than once just refreshes the
 * acceptance timestamp.
 *
 * Response (200): {"message": "Security notice accepted"}.
 */
router.post("/security-notice/accept", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        await pool.query(
            `INSERT INTO user_security_notice_acknowledgements (user_id, accepted_date)
             VALUES ($1, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) DO UPDATE SET accepted_date = CURRENT_TIMESTAMP`,
            [userId]
        );

        res.status(200).json({message: "Security notice accepted"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * POST /user/2fa/setup
 * ----------------------
 * Start (or restart) two-factor auth setup: generates a new TOTP secret,
 * stores it on the account (leaving `totp_enabled` untouched - a stored
 * secret alone doesn't turn 2FA on, see POST /user/2fa/enable), and returns
 * it plus a scannable QR code. Calling this again before enabling discards
 * whatever secret was generated by a previous call.
 *
 * Auth: required.
 *
 * Response (200): { "secret": "JBSWY3DPEHPK3PXP", "qrCodeDataUrl": "data:image/png;base64,..." }
 */
router.post("/2fa/setup", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({message: "User not found"});
        }

        const secret = generateTotpSecret();
        await pool.query("UPDATE users SET totp_secret = $1 WHERE id = $2", [secret, userId]);

        const otpauthUrl = buildOtpAuthUrl(userResult.rows[0].email, secret);
        const qrCodeDataUrl = await generateQrCodeDataUrl(otpauthUrl);

        res.status(200).json({secret, qrCodeDataUrl});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * POST /user/2fa/enable
 * ------------------------
 * Confirm setup and turn two-factor auth on: verifies a code against the
 * secret stored by POST /user/2fa/setup, then flips `totp_enabled` and
 * generates a fresh set of one-time backup codes (any previous set is
 * discarded).
 *
 * Rate limited: 5 requests / 5 minutes (see `twoFaLimiter`).
 * Auth: required. Body: { "code": "123456" }
 *
 * Response (200): { "success": true, "backupCodes": ["A1B2C3D4-E5F6G7H8", ...] }
 * (shown to the user exactly once - only hashes are stored).
 *
 * Responses: 400 {"message": "..."} (no pending setup) |
 *            401 {"message": "Invalid verification code."}.
 */
router.post("/2fa/enable", requireAuth, twoFaLimiter, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);
    const {code} = req.body;

    if (!code) {
        return res.status(400).json({message: "Missing verification code"});
    }

    try {
        const userResult = await pool.query("SELECT totp_secret FROM users WHERE id = $1", [userId]);
        const secret = userResult.rows[0]?.totp_secret;

        if (!secret) {
            return res.status(400).json({message: "Start setup before enabling two-factor authentication."});
        }

        if (!(await verifyTotpCode(secret, String(code).trim()))) {
            return res.status(401).json({message: "Invalid verification code."});
        }

        const backupCodes = generateBackupCodes();
        const hashedCodes = await Promise.all(backupCodes.map((c) => appService.hashPassword(c)));

        // Discard any codes from a previous enable/setup cycle, then store
        // the fresh set, in the same transaction as flipping totp_enabled
        // so a mid-way failure can't leave 2FA "on" with no valid codes.
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("UPDATE users SET totp_enabled = TRUE WHERE id = $1", [userId]);
            await client.query("DELETE FROM user_backup_codes WHERE user_id = $1", [userId]);
            for (const hash of hashedCodes) {
                await client.query(
                    "INSERT INTO user_backup_codes (user_id, code_hash) VALUES ($1, $2)",
                    [userId, hash]
                );
            }
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }

        res.status(200).json({success: true, backupCodes});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * POST /user/2fa/disable
 * -------------------------
 * Turn two-factor auth off: requires the account password (not the TOTP
 * code) as re-auth, since this removes a security layer rather than adding
 * one. Clears the stored secret and every backup code.
 *
 * Rate limited: 5 requests / 5 minutes (see `passwordChangeLimiter`).
 * Auth: required. Body: { "password": "S3cret!123" }
 *
 * Responses: 200 {"success": true, "message": "Two-factor authentication disabled"} |
 *            401 {"message": "Invalid password."}.
 */
router.post("/2fa/disable", requireAuth, passwordChangeLimiter, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);
    const {password} = req.body;

    if (!password) {
        return res.status(400).json({message: "Missing password"});
    }

    try {
        const userResult = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({message: "Invalid password."});
        }

        const passwordMatches = await appService.comparePassword(password, userResult.rows[0].password);
        if (!passwordMatches) {
            return res.status(401).json({message: "Invalid password."});
        }

        await pool.query("UPDATE users SET totp_enabled = FALSE, totp_secret = NULL WHERE id = $1", [userId]);
        await pool.query("DELETE FROM user_backup_codes WHERE user_id = $1", [userId]);

        res.status(200).json({success: true, message: "Two-factor authentication disabled"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

export default router;