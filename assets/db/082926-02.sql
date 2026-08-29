-- Consolidated migration for the schema changes made on 2026-08-29 (session
-- invalidation + password column).
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Session invalidation: bumped on password change so a JWT issued before
-- the change (a stolen token included) is rejected by requireAuth even
-- though its signature is still valid. Existing users default to 0, so any
-- token issued before this migration that lacks a token_version claim will
-- fail the comparison and force a one-time re-login.
ALTER TABLE users
    ADD COLUMN token_version INT NOT NULL DEFAULT 0;

-- bcrypt hashes are exactly 60 chars so VARCHAR(64) has worked so far, but
-- leaves no room for a future hashing algorithm (e.g. argon2id) with longer
-- output. Widen it now while it's a no-op.
ALTER TABLE users
    ALTER COLUMN password TYPE TEXT;
