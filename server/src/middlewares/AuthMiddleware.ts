import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {appService} from "../AppService";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    // only development
    if (appService.allowDevAuth()) {
        console.log("Serving DEVELOPMENT token")
        appService.getLogger().info("Serving DEVELOPMENT token")
        // Fake decoded token for dev
        req.cookies.token = jwt.sign(
            {user_id: 1}, // fake user ID
            appService.getJwtSecret(),
            {
                expiresIn: Math.floor(appService.getSessionTime() / 1000),
                audience: "paperbooks",
                issuer: "paperbooks.xyz"
            }
        );
    }

    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login"); // Redirect to login;
    }

    let decoded;
    try {
        decoded = jwt.verify(token, appService.getJwtSecret(), {
            algorithms: ["HS256"],
            audience: "paperbooks",
            issuer: "paperbooks.xyz"
        }) as { user_id: number; exp: number };
    } catch (err: any) {
        console.log("Error decoding JWT", err)
        appService.getLogger().error(err.toString());
        return res.status(401).json({message: "Unauthorized"});
    }

    const pool = appService.getDatabasePool();
    const result = await pool.query({
        name: "user-prep-stmt",
        text: "SELECT id FROM users WHERE id = $1 AND disabled = FALSE",
        values: [decoded.user_id]
    });

    console.log("result.rowCount", result.rowCount)
    if (result.rowCount == 0) {
        return res.status(401).json({message: "Unauthorized"});
    }

    // Check if token is near expiry (e.g., less than 5 minutes left)
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    if (timeLeft < 5 * 60) {
        // Issue new token with extended expiration
        const newToken = jwt.sign(
            {user_id: decoded.user_id},
            appService.getJwtSecret(),
            {
                expiresIn: Math.floor(appService.getSessionTime() / 1000),
                audience: "paperbooks",
                issuer: "paperbooks.xyz"
            }
        );

        res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appService.getSessionTime()
        });
    }

    next();
};
