import express, {Request, Response} from "express";
import session from "express-session";
import {appService} from "../AppService";
import crypto from "crypto";
import path from "path";
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = express.Router();

// Session middleware
router.use(
    session({
        secret: "your_secret_key", // TODO: CREATE ENV VARIABLE
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,  // Prevents client-side JS access
            secure: false,   // Set to true in production with HTTPS // TODO: CREATE ENV VARIABLE
            maxAge: 45 * 60 * 1000, // Session expires in 15 minutes // TODO: CREATE ENV VARIABLE
        }, // Set to true if using HTTPS
    })
);


// Handle root path ('/')
router.get("/", (req: Request, res: Response) => {
    // Check if the user is authenticated by looking at the session
    //@ts-ignore
    if (req.session.user) {
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
    if (req.session.user) {
        return res.redirect("/app");
    }
    res.sendFile(path.join(__dirname, "..", "assets", "login.html"));
});

const distPath = path.join(__dirname, "..", "..", "..", "dist");

router.use("/app/resources", express.static(path.join(distPath, "resources"), {
    setHeaders: (res, path) => {
        console.log("handle mime", path)
        if (path.endsWith(".css")) {
            res.set('Content-Type', 'text/css');
        }
    }
}));

//@ts-ignore
router.get("/app", requireAuth, (req: Request, res: Response) => {
    console.log("render APP page from:", "index.html")
    res.sendFile(path.join(distPath,"index.html" ));
    return res.status(200)
});

//@ts-ignore
router.get("/app/*", requireAuth, (req: Request, res: Response) => {
    console.log("render APP page from:", "index.html")
    res.sendFile(path.join(distPath,"index.html" ));
    return res.status(200)
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

        console.log("correct password for user:" + username);

        console.log("Updating last login date for user:" + username);
        // Update the last login date
        const updateLoginQuery = `
            UPDATE users
            SET last_login_date = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(updateLoginQuery, [user.id]);

        console.log("Setting session and cookie for user:" + username);

        // Store user in session
        //@ts-ignore
        req.session.user = {id: user.id, code: user.code};

        // Set cookie
        res.cookie("session_id", req.sessionID, {
            httpOnly: true,
            secure: false,   // Set to true in production with HTTPS // TODO: CREATE ENV VARIABLE
            maxAge: 45 * 60 * 1000, // Session expires in 15 minutes // TODO: CREATE ENV VARIABLE
        });

        console.log("Redirecting to /app for user:" + username);

        res.json({ success: true, message: "Login successful", redirectUrl: "/app" });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

// Logout route
router.post("/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({message: "Logout failed"});
        }
        res.json({message: "Logged out successfully"});
    });
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
