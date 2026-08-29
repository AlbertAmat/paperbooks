/**
 * =============================================================================
 * AuthRoute
 * =============================================================================
 * Mounted directly at `/` (not under `/api/rest`, see AppService.__loadRoutes).
 * Owns the whole unauthenticated surface: serving the login/register static
 * pages, the login/register/logout POST handlers, session-cookie issuance,
 * and (once logged in) serving the compiled SPA under `/app`.
 *
 * Session model: on successful login/register a signed JWT is stored in an
 * httpOnly `token` cookie (see `AppService.createSessionToken`); every
 * subsequent request is authenticated by `requireAuth`
 * (server/src/middlewares/AuthMiddleware.ts) reading that cookie.
 */
import express, {Request, Response} from "express";
import {appService} from "../AppService";
import path from "path";
import rateLimit from "express-rate-limit";
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = express.Router();

// Stricter than the app-wide limiter in AppService: login/register are the
// endpoints most worth protecting from brute-force/credential-stuffing.
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // only allow 5 requests per IP per window
    message: "Too many attempts, please try again after 15 minutes.",
});

// Compiled Vue app: alongside the server in production (Docker image),
// under client/dist during local development.
const clientDistPath = process.env.NODE_ENV === "production" ?  path.join(__dirname, "../../../client") : path.join(__dirname, '../../../client/dist')

/**
 * GET /app/assets/*  (static)
 * -----------------------------
 * Serves the SPA's built JS/CSS assets. Auth-gated so the app bundle itself
 * isn't served to unauthenticated clients.
 */
router.use("/app/assets", requireAuth, express.static(path.join(clientDistPath, "assets"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
            res.set('Content-Type', 'text/css');
        }
    }
}));

/**
 * GET /app
 * ---------
 * Serves the SPA's `index.html` entry point (production only - in dev the
 * Vite dev server handles this). Auth: required.
 */
router.get('/app', requireAuth, async (req: Request, res: Response) => {
    const appPath = path.join(clientDistPath, "index.html");

    appService.getLogger().debug(`serving /app index: ${appPath}`);
    res.sendFile(appPath);
})

/**
 * GET /app/*
 * -----------
 * Catch-all so client-side (Vue Router) routes like `/app/book/12` still
 * resolve to the SPA shell on a hard refresh. Auth: required.
 */
router.get('/app/*', requireAuth, async (req: Request, res: Response) => {
    const appPath = path.join(clientDistPath, "index.html");

    appService.getLogger().debug(`serving /app/* index: ${appPath}`);
    res.sendFile(appPath);
})

/**
 * GET /
 * ------
 * Redirects to `/app` if a session cookie is present, otherwise to `/login`.
 * Unauthenticated - it only checks for the cookie's presence, not validity
 * (an invalid/expired token still lands the user on `/app`, where
 * `requireAuth` then bounces them to `/login`).
 */
router.get("/", (req: Request, res: Response) => {
    // Check if the user is authenticated by looking at the session

    //@ts-ignore
    if (req.cookies.token) {
        appService.getLogger().debug("User already logged in, redirecting to /app...");
        return res.redirect("/app"); // Redirect to /app if user is logged in
    } else {
        appService.getLogger().debug("User not logged in, redirecting to /login...");
        return res.redirect("/login"); // Redirect to login page if user is not logged in
    }
});

/**
 * GET /login
 * -----------
 * Serves the static login page and clears any existing session cookie.
 * Unauthenticated.
 */
//@ts-ignore
router.get("/login", (req: Request, res: Response) => {
    // If user goes to login page, clear the current token.
    // we can improve it, by checking if the token is valid, etc ad redirect to app
    // at the moment, we will clear the token
    res.clearCookie("token");
    res.sendFile(path.join(__dirname, "..", "assets", "login.html"));
});

/** GET /background.png - static background image used by the login/register pages. */
router.use("/background.png", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "assets", "background.png"));
});

/**
 * POST /login
 * ------------
 * Authenticate with username/email + password, issue a session cookie.
 *
 * Rate limited: 5 requests / 5 minutes / IP (see `authLimiter`).
 * Unauthenticated. Body: { "username": "jdoe", "password": "S3cret!123" }
 * (`username` may be either the user's code or email).
 *
 * Example response (200):
 *  { "success": true, "message": "Login successful", "redirectUrl": "/app" }
 * Sets an httpOnly `token` cookie (JWT, expires per `SESSION_TIME` env var).
 *
 * Responses: 400 missing fields | 401 invalid credentials | 500 server error.
 */
//@ts-ignore
router.post("/login", authLimiter,  async (req: Request, res: Response) => {
    appService.getLogger().debug("Handle login authentication");
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Missing username or password"});
    }

    try {
        const pool = appService.getDatabasePool();
        const userQuery = "SELECT id, code, password, token_version FROM users WHERE (code = $1 OR email = $2) AND disabled = FALSE";
        const userResult = await pool.query(userQuery, [username, username]);

        if (userResult.rows.length === 0) {
            appService.getLogger().debug("No user found for:" + username);
            return res.status(401).json({message: "Invalid username or password."});
        }

        const user = userResult.rows[0];

        const comparePassword = await appService.comparePassword(password, user.password);
        if (!comparePassword) {
            appService.getLogger().debug("invalid password for user:" + username);
            return res.status(401).json({message: "Invalid username or password."});
        }

        appService.getLogger().debug("Updating last login date for user:" + username);
        // Update the last login date
        const updateLoginQuery = `
            UPDATE users
            SET last_login_date = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(updateLoginQuery, [user.id]);

        appService.getLogger().debug("Setting session and cookie for user:" + username);

        const userToken = appService.createSessionToken(user.id, user.token_version);

        // Send JWT in cookie
        res.cookie("token", userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appService.getSessionTime()
        });

        appService.getLogger().debug("Redirecting to /app for user:" + username);

        res.json({success: true, message: "Login successful", redirectUrl: "/app"});
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

/**
 * GET /register
 * --------------
 * Serves the static registration page, or redirects to `/app` if a session
 * cookie is already present. Unauthenticated.
 */
router.get("/register", (req: Request, res: Response) => {
    //@ts-ignore
    if (req.cookies.token) {
        return res.redirect("/app");
    }
    res.sendFile(path.join(__dirname, "..", "assets", "register.html"));
});

/**
 * POST /register
 * ----------------
 * Create a new user account.
 *
 * Rate limited: 5 requests / 5 minutes / IP (see `authLimiter`).
 * Unauthenticated.
 * Body:
 *  {
 *    "userName": "jdoe",             // unique login code
 *    "email": "jane@example.com",    // unique, validated with a basic regex
 *    "name": "Jane Doe",
 *    "password": "S3cret!123"        // min 8 chars, needs an uppercase letter,
 *                                    // a digit and a special character
 *  }
 *
 * Example response (201):
 *  { "success": true, "message": "Register successful", "redirectUrl": "/login" }
 *
 * Responses: 400 missing/invalid fields, weak password, or a duplicate
 *            email/username (deliberately generic - see CWE-203 note below) |
 *            500 server error.
 */
router.post("/register", authLimiter, async (req: Request, res: Response) => {
    const { userName, email, name, password } = req.body;

    // Basic input validation
    if (!email || !userName || !name || !password) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and include a number, an uppercase letter, and a special symbol."
        });
    }

    try {
        const pool = appService.getDatabasePool();

        // Hash the password securely
        const hashedPassword = await appService.hashPassword(password);

        // Use INSERT with unique constraints to avoid race conditions
        const insertQuery = `
            INSERT INTO users (name, code, email, password) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `;

        await pool.query(insertQuery, [name, userName, email, hashedPassword]);

        return res.status(201).json({
            success: true,
            message: "Register successful",
            redirectUrl: "/login",
        });

    } catch (error: any) {
        // Handle unique constraint violation with a generic message - confirming
        // that a specific email/username is already registered would let an
        // attacker enumerate existing accounts (CWE-203).
        if (error.code === "23505") { // PostgreSQL unique violation
            return res.status(400).json({ message: "Unable to register with the provided information." });
        }

        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/**
 * GET /logout
 * ------------
 * Clear the session cookie and redirect to `/login`. No server-side session
 * to invalidate (JWTs are stateless) - see `token_version` in
 * AuthMiddleware.ts for the mechanism that revokes tokens instead.
 */
router.get("/logout", (req: Request, res: Response) => {
    appService.getLogger().debug("Logout user");
    res.clearCookie("token");
    return res.redirect("/login"); // Redirect to login;
});

export default router;
