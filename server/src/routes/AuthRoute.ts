import express, {Request, Response} from "express";
import {appService} from "../AppService";
import jwt from "jsonwebtoken";
import path from "path";

const router = express.Router();

// Helper: Create token
function createToken(userId: number) {
    return jwt.sign({ user_id: userId }, appService.getJwtSecret(), { expiresIn: Math.floor(appService.getSessionTime() / 1000) });
}

// TODO: REVIEW IF THIS ENDPOINT SHOULD BE IN HEARE
const distPath = path.join(__dirname, '../../../client/dist')
router.use("/assets", express.static(path.join(distPath, "assets"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
            res.set('Content-Type', 'text/css');
        }
    }
}));

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
    console.log("render login page")
    //@ts-ignore
    if (req.cookies.token) {
        return res.redirect("/app");
    }
    res.sendFile(path.join(__dirname, "..", "assets", "login.html"));
});

// Login route
//@ts-ignore
router.post("/login", async (req: Request, res: Response) => {
    console.log("Handle login authentication")
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Missing username or password"});
    }

    try {
        const pool = appService.getDatabasePool();
        const userQuery = "SELECT id, code, password FROM users WHERE code = $1 OR email = $2";
        const userResult = await pool.query(userQuery, [username, username]);

        if (userResult.rows.length === 0) {
            console.log("No user found for:" + username);
            return res.status(401).json({message: "Invalid username or password."});
        }

        const user = userResult.rows[0];
        const hashedInputPassword = appService.hashPassword(password);

        if (hashedInputPassword !== user.password) {
            console.log("invalid password for user:" + username);
            return res.status(401).json({ message: "Invalid username or password." });
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

        const userToken = createToken(user.id);
        console.log("userToken", userToken)

        // Send JWT in cookie
        res.cookie("token", userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appService.getSessionTime()
        });

        console.log("Redirecting to /app for user:" + username);

        res.json({ success: true, message: "Login successful", redirectUrl: "/app" });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

// Logout route
router.get("/logout", (req: Request, res: Response) => {
    res.clearCookie("token");
    return res.redirect("/login"); // Redirect to login;
});

// Session check route
//@ts-ignore
router.get("/session", (req: Request, res: Response) => {
    //@ts-ignore
    if (req.session.user) {
        //@ts-ignore
        return res.json({user: req.session.user});
    }
    return res.status(401).json({message: "Not logged in"});
});

export default router;
