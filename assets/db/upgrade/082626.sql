-- Consolidated migration for all schema changes made on 2026-08-26.
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Customer groups: organize customers into named groups.
CREATE TABLE customer_groups
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    user_id     INT NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_customer_group
        UNIQUE (user_id, name)
);

ALTER TABLE customers
    ADD COLUMN group_id INT,
    ADD CONSTRAINT fk_customer_group
        FOREIGN KEY (group_id)
            REFERENCES customer_groups (id)
            ON DELETE SET NULL;
