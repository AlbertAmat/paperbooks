-- Adds tracking for the public-institution security-measures notice shown
-- after login (see SecurityNoticeDialog.vue).
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

CREATE TABLE user_security_notice_acknowledgements
(
    id            SERIAL PRIMARY KEY,
    user_id       INT       NOT NULL UNIQUE,
    sent_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
