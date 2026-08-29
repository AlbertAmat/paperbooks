/**
 * =============================================================================
 * UserRoute
 * =============================================================================
 * Mounted at `/api/rest/user`. Self-service account management for the
 * currently logged-in user: profile picture, profile fields, password
 * change, and account deletion. All routes require auth and act on the
 * caller's own account only (id taken from the session, never from params).
 */
import {Router, Request, Response} from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";
import multer from "multer";
import rateLimit from "express-rate-limit";

const router = Router();

// Strict limiter for the current-password check, same shape as the
// login/register limiter - without it, a stolen/short-lived session token
// could be used to brute-force the account's current password.
const passwordChangeLimiter = rateLimit({
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

export default router;