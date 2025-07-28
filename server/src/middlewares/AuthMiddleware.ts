import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    // TODO: UST FOR DEV: REMOOOOVE!!!!
    //@ts-ignore
    req.session.user = {id: 1, code: "admin1"};

    //@ts-ignore
    if (!req.session || !req.session.user) {
        res.clearCookie("session_id"); // Clear expired session cookie
        return res.redirect("/login"); // Redirect to login
    }

    // Extend session expiration on activity
    req.session.cookie.maxAge = 15 * 60 * 1000; // Reset expiration time
    next();
};
