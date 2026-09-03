/**
 * Express middleware that gates every authenticated route.
 *
 * Flow: read the `token` httpOnly cookie -> verify its JWT signature/claims
 * -> look up the user and compare `token_version` (a DB counter bumped on
 * password change, so old tokens can be revoked even though JWTs are
 * otherwise stateless) -> look up the specific `user_sessions` row the
 * token's `sid` claim identifies and reject if it's been individually
 * revoked (see "Log out this device" in Settings) -> if valid and about to
 * expire, silently reissue a fresh cookie -> call `next()`.
 *
 * In development (`ALLOW_DEV_AUTH=true`), it skips real auth entirely and
 * fakes a session for user id 1 - never enable this in production. The fake
 * token's `sid` is a sentinel that never matches a real `user_sessions` row
 * (there was never a real login to create one), so the per-session check
 * below is skipped for it too.
 *
 * Usage: `router.get('/foo', requireAuth, handler)`.
 * Failure responses: redirects to `/login` (no cookie) or `401 Unauthorized`
 * (invalid/expired/revoked token).
 */
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {appService} from "../AppService";

/** Sentinel `sid` for the fake ALLOW_DEV_AUTH token - never matches a real `user_sessions` row. Exported so handlers reissuing a token (e.g. password change) can fall back to it when `req.sessionKey` is unset. */
export const DEV_SESSION_KEY = "dev";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const pool = appService.getDatabasePool();

    // only development
    if (appService.allowDevAuth()) {
        appService.getLogger().info("Serving DEVELOPMENT token")

        // Look up the real current token_version for the fake user so the
        // check below (identical for dev and real tokens) accepts it.
        const devUser = await pool.query(
            "SELECT token_version FROM users WHERE id = 1 AND disabled = FALSE"
        );
        const devTokenVersion = devUser.rows[0]?.token_version ?? 0;

        // Fake decoded token for dev
        req.cookies.token = appService.createSessionToken(1, devTokenVersion, DEV_SESSION_KEY); // fake user ID
    }

    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login"); // Redirect to login;
    }

    let decoded;
    try {
        decoded = jwt.verify(token, appService.getJwtSecret(), {
            algorithms: ["HS256"],
            audience: "vaultisse",
            issuer: "vaultisse.com"
        }) as { user_id: number; token_version: number; sid: string; exp: number };
    } catch (err: any) {
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

    if (decoded.sid !== DEV_SESSION_KEY) {
        const sessionResult = await pool.query(
            "SELECT id FROM user_sessions WHERE session_key = $1 AND user_id = $2 AND revoked_date IS NULL",
            [decoded.sid, decoded.user_id]
        );

        if (sessionResult.rowCount === 0) {
            return res.status(401).json({message: "Unauthorized"});
        }

        req.sessionId = sessionResult.rows[0].id;
        req.sessionKey = decoded.sid;

        // Best-effort and throttled (only writes once the row is more than
        // a minute stale) - keeps "Active sessions" reasonably fresh
        // without a DB write on every single authenticated request.
        pool.query(
            "UPDATE user_sessions SET last_seen_date = NOW() WHERE id = $1 AND last_seen_date < NOW() - INTERVAL '1 minute'",
            [req.sessionId]
        ).catch((err) => appService.getLogger().error("Error updating session last_seen_date: " + err));
    }

    // Check if token is near expiry (e.g., less than 5 minutes left)
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    if (timeLeft < 5 * 60) {
        // Issue new token with extended expiration
        const newToken = appService.createSessionToken(decoded.user_id, currentTokenVersion, decoded.sid);

        res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: appService.getSessionTime()
        });
    }

    next();
};
