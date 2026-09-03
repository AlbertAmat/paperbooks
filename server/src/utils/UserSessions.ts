/**
 * Bookkeeping for `user_sessions` - one row per issued login session,
 * powering Settings > Security's "Active sessions" list and per-session
 * revocation. See AppService.createSessionToken (the `sid` claim embeds
 * `session_key`) and AuthMiddleware.ts (the per-request lookup).
 */
import {Pool, PoolClient} from "pg";
import crypto from "crypto";

export interface CreatedSession {
    /** Opaque random value embedded in the session JWT's `sid` claim - never the JWT itself. */
    sessionKey: string;
    /** DB id of the new `user_sessions` row. */
    sessionId: number;
}

/**
 * Insert a new `user_sessions` row for a fresh login/2FA completion.
 * @param db Pool or client to run the query on.
 * @param userId The account signing in.
 * @param userAgent The request's `User-Agent` header, if any.
 * @param ipAddress The request's client IP, if any.
 */
export async function createUserSession(
    db: Pool | PoolClient,
    userId: number,
    userAgent: string | undefined,
    ipAddress: string | undefined
): Promise<CreatedSession> {
    const sessionKey = crypto.randomUUID();

    const result = await db.query(
        `INSERT INTO user_sessions (user_id, session_key, user_agent, ip_address)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [userId, sessionKey, userAgent ?? null, ipAddress ?? null]
    );

    return {sessionKey, sessionId: result.rows[0].id};
}
