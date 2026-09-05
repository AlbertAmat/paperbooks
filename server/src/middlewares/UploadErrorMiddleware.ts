/**
 * =============================================================================
 * UploadErrorMiddleware
 * =============================================================================
 * Multer reports a rejected upload (oversized file, or a `fileFilter`
 * rejection) by calling `next(err)` instead of invoking the route handler,
 * and this app registers no app-wide Express error handler - so, left alone,
 * that error falls through to Express's built-in default handler and the
 * client gets a bare 500 with no useful message.
 *
 * `handleUploadError()` returns an Express error-handling middleware (4-arg
 * signature) to place directly after a `multer(...).single(...)` call in a
 * route's middleware list. Express routes `next(err)` to the nearest
 * error-handling middleware ahead in the stack, so this intercepts it there;
 * a successful upload calls plain `next()`, which skips straight past this
 * (error handlers are only invoked via `next(err)`) to the real handler.
 */
import {ErrorRequestHandler} from "express";
import multer from "multer";

export function handleUploadError(maxSizeMb: number, format: "text" | "json" = "text"): ErrorRequestHandler {
    return (err, req, res, next) => {
        if (!err) {
            return next();
        }

        const isTooLarge = err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE";
        const status = isTooLarge ? 413 : 400;
        const message = isTooLarge
            ? `File exceeds the maximum allowed upload size of ${maxSizeMb}MB`
            : (err.message || "Upload failed");

        if (format === "json") {
            res.status(status).json({error: message});
        } else {
            res.status(status).send(message);
        }
    };
}
