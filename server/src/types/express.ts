/**
 * Augments Express's Request with fields `requireAuth` (AuthMiddleware.ts)
 * attaches after validating a session, so downstream handlers (password
 * change, logout, session management in UserRoute.ts) can use them without
 * re-decoding the JWT or re-querying the DB.
 */
export {};

// Deliberately a .ts file, not .d.ts: a .d.ts is never emitted, so the
// side-effect import in AppService.ts (needed so ts-node's language service
// is guaranteed to load this file and merge the augmentation below - it
// won't otherwise, since nothing else imports it) would fail to resolve at
// runtime with MODULE_NOT_FOUND. A .ts file compiles to a real (near-empty)
// JS file, so the same import works both for type-checking and at runtime.
declare global {
    namespace Express {
        interface Request {
            /** DB id of the current `user_sessions` row. Unset only when ALLOW_DEV_AUTH bypasses real sessions. */
            sessionId?: number;
            /** Opaque session key (the JWT's `sid` claim) for the current session. Unset only when ALLOW_DEV_AUTH bypasses real sessions. */
            sessionKey?: string;
        }
    }
}
