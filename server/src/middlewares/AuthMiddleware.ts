import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {appService} from "../AppService";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const pool = appService.getDatabasePool();

    // only development
    if (appService.allowDevAuth()) {
        console.log("Serving DEVELOPMENT token")
        appService.getLogger().info("Serving DEVELOPMENT token")

        // Look up the real current token_version for the fake user so the
        // check below (identical for dev and real tokens) accepts it.
        const devUser = await pool.query(
            "SELECT token_version FROM users WHERE id = 1 AND disabled = FALSE"
        );
        const devTokenVersion = devUser.rows[0]?.token_version ?? 0;

        // Fake decoded token for dev
        req.cookies.token = appService.createSessionToken(1, devTokenVersion); // fake user ID
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
        }) as { user_id: number; token_version: number; exp: number };
    } catch (err: any) {
        console.log("Error decoding JWT", err)
        appService.getLogger().error(err.toString());
        return res.status(401).json({message: "Unauthorized"});
    }

    const result = await pool.query({
        name: "user-prep-stmt",
        text: "SELECT id, token_version FROM users WHERE id = $1 AND disabled = FALSE",
        values: [decoded.user_id]
    });

    if (result.rowCount == 0) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const currentTokenVersion = result.rows[0].token_version;

    // Tokens issued before a password change (or any other event that bumps
    // token_version) no longer match - reject them even though the JWT
    // signature itself is still valid. This is what makes logout-elsewhere /
    // password-change session revocation possible with stateless JWTs.
    if (decoded.token_version !== currentTokenVersion) {
        return res.status(401).json({message: "Unauthorized"});
    }

    // Check if token is near expiry (e.g., less than 5 minutes left)
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    if (timeLeft < 5 * 60) {
        // Issue new token with extended expiration
        const newToken = appService.createSessionToken(decoded.user_id, currentTokenVersion);

        res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appService.getSessionTime()
        });
    }

    next();
};
