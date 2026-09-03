-- Consolidated migration for all schema changes made on 2026-09-03.
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Per-user toggle for whether the Loans and Customers pages (and their nav
-- items) are shown. Off by default - most accounts just track a personal
-- collection and don't lend books out. Set from the Settings page (see
-- PATCH /user/leasing in UserRoute.ts, AppMenu.vue and Router.ts client-side).
ALTER TABLE users
    ADD COLUMN leasing_enabled BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'USERCONF_FEATURES', 'Features'),
       ('en', 'USERCONF_LEASING', 'Leasing'),
       ('en', 'USERCONF_LEASING_DESC', 'Track who''s borrowing what. Turns on the Loans and Customers pages in the sidebar.'),
       ('en', 'SNACKBAR_LEASING_UPDATED', 'Leasing preference updated'),

       ('ca', 'USERCONF_FEATURES', 'Funcionalitats'),
       ('ca', 'USERCONF_LEASING', 'Préstecs'),
       ('ca', 'USERCONF_LEASING_DESC', 'Fes un seguiment de qui té cada llibre. Activa les pàgines de Préstecs i Clients al menú lateral.'),
       ('ca', 'SNACKBAR_LEASING_UPDATED', 'Preferència de préstecs actualitzada'),

       ('es', 'USERCONF_FEATURES', 'Funciones'),
       ('es', 'USERCONF_LEASING', 'Préstamos'),
       ('es', 'USERCONF_LEASING_DESC', 'Haz un seguimiento de quién tiene cada libro. Activa las páginas de Préstamos y Clientes en el menú lateral.'),
       ('es', 'SNACKBAR_LEASING_UPDATED', 'Preferencia de préstamos actualizada'),

       ('it', 'USERCONF_FEATURES', 'Funzionalità'),
       ('it', 'USERCONF_LEASING', 'Prestiti'),
       ('it', 'USERCONF_LEASING_DESC', 'Tieni traccia di chi ha ogni libro. Attiva le pagine Prestiti e Clienti nel menu laterale.'),
       ('it', 'SNACKBAR_LEASING_UPDATED', 'Preferenza sui prestiti aggiornata');
