-- Upgrade to v1.1.0 (3 of 3) - schema changes made on 2026-09-05.
-- Brings an already-installed database in line with the v1.1.0 databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Require every account (not just public institutions) to accept the Terms
-- of Service once, tracked the same way as user_security_notice_acknowledgements
-- but without the is_public_institution gate.
CREATE TABLE user_terms_of_service_acknowledgements
(
    id            SERIAL PRIMARY KEY,
    user_id       INT       NOT NULL UNIQUE,
    sent_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
