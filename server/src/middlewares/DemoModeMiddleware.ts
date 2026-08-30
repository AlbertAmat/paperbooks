/**
 * When DEMO_MODE=true, rejects every state-changing request so a public
 * demo deployment can't be used to modify or pollute the shared data.
 * GET/HEAD/OPTIONS always pass through; the login flow is explicitly
 * allowlisted since visitors still need to sign in as the demo user.
 * `/register` is deliberately NOT allowlisted - the demo ships with a
 * fixed account instead of letting visitors create their own.
 *
 * Mounted globally in AppService, ahead of the route registry, so it
 * covers both AuthRoute (mounted at "/") and every "/api/rest/*" router.
 */
import {Request, Response, NextFunction} from "express";

const ALLOWED_WRITE_PATHS = new Set(["/login", "/login/2fa"]);

export const blockWritesInDemo = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.DEMO_MODE !== "true") {
        return next();
    }

    const isSafeMethod = req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS";
    if (isSafeMethod || ALLOWED_WRITE_PATHS.has(req.path)) {
        return next();
    }

    return res.status(403).json({message: "This is a read-only demo - writes are disabled."});
};
