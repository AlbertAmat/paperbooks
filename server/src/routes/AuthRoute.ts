import express, {Request, Response} from "express";
import {appService} from "../AppService";
import path from "path";
import rateLimit from "express-rate-limit";
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = express.Router();

// rate limit specific for login and register, thsi limiter is more strict than the generic of the entire app
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // only allow 5 requests per IP per window
    message: "Too many attempts, please try again after 15 minutes.",
});

const clientDistPath = process.env.NODE_ENV === "production" ?  path.join(__dirname, "../../../client") : path.join(__dirname, '../../../client/dist')
router.use("/app/assets", requireAuth, express.static(path.join(clientDistPath, "assets"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
            res.set('Content-Type', 'text/css');
        }
    }
}));

// serve application
// only used in production
router.get('/app', requireAuth, async (req: Request, res: Response) => {
    const appPath = path.join(clientDistPath, "index.html");

    console.log("serving /app index:", appPath)
    res.sendFile(appPath);
})

router.get('/app/*', requireAuth, async (req: Request, res: Response) => {
    const appPath = path.join(clientDistPath, "index.html");

    console.log("serving /app/* index:", appPath)
    res.sendFile(appPath);
})

// Handle root path ('/')
router.get("/", (req: Request, res: Response) => {
    // Check if the user is authenticated by looking at the session

    //@ts-ignore
    if (req.cookies.token) {
        console.log("User already logged in, redirecting to /app...");
        return res.redirect("/app"); // Redirect to /app if user is logged in
    } else {
        console.log("User not logged in, redirecting to /login...");
        return res.redirect("/login"); // Redirect to login page if user is not logged in
    }
});

// Serve the login page
//@ts-ignore
router.get("/login", (req: Request, res: Response) => {
    // If user goes to login page, clear the current token.
    // we can improve it, by checking if the token is valid, etc ad redirect to app
    // at the moment, we will clear the token
    res.clearCookie("token");
    res.sendFile(path.join(__dirname, "..", "assets", "login.html"));
});

router.use("/background.png", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "assets", "background.png"));
});

// Login route
//@ts-ignore
router.post("/login", authLimiter,  async (req: Request, res: Response) => {
    console.log("Handle login authentication")
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Missing username or password"});
    }

    try {
        const pool = appService.getDatabasePool();
        const userQuery = "SELECT id, code, password, token_version FROM users WHERE (code = $1 OR email = $2) AND disabled = FALSE";
        const userResult = await pool.query(userQuery, [username, username]);

        if (userResult.rows.length === 0) {
            console.log("No user found for:" + username);
            return res.status(401).json({message: "Invalid username or password."});
        }

        const user = userResult.rows[0];

        const comparePassword = await appService.comparePassword(password, user.password);
        if (!comparePassword) {
            console.log("invalid password for user:" + username);
            return res.status(401).json({message: "Invalid username or password."});
        }

        console.log("Updating last login date for user:" + username);
        // Update the last login date
        const updateLoginQuery = `
            UPDATE users
            SET last_login_date = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(updateLoginQuery, [user.id]);

        console.log("Setting session and cookie for user:" + username);

        const userToken = appService.createSessionToken(user.id, user.token_version);

        // Send JWT in cookie
        res.cookie("token", userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appService.getSessionTime()
        });

        console.log("Redirecting to /app for user:" + username);

        res.json({success: true, message: "Login successful", redirectUrl: "/app"});
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.get("/register", (req: Request, res: Response) => {
    //@ts-ignore
    if (req.cookies.token) {
        return res.redirect("/app");
    }
    res.sendFile(path.join(__dirname, "..", "assets", "register.html"));
});

/**
 * Register users
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
        // Handle unique constraint violation
        if (error.code === "23505") { // PostgreSQL unique violation
            return res.status(409).json({ message: "Email or username already exists." });
        }

        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


// Logout route
router.get("/logout", (req: Request, res: Response) => {
    console.log("Logout user")
    res.clearCookie("token");
    return res.redirect("/login"); // Redirect to login;
});

export default router;
