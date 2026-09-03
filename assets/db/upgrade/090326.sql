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

-- One row per issued login session, so Settings > Security can list a
-- user's actual active sessions (device/IP/last-seen) and let them revoke
-- one individually. session_key is an opaque random value embedded in the
-- session JWT's `sid` claim (see AppService.createSessionToken) - never the
-- JWT itself - and looked up on every authenticated request (AuthMiddleware.ts).
-- Timestamps are TIMESTAMPTZ (not the bare TIMESTAMP used elsewhere in this
-- schema) deliberately: these two are the first tables whose dates get
-- compared server-side (e.g. GET /user/sessions' "seen within SESSION_TIME"
-- filter) and shown to the client as absolute instants, and node-postgres
-- reads a bare TIMESTAMP by assuming it's in the Node process's local
-- timezone rather than the DB session's - silently shifting it whenever the
-- two differ. TIMESTAMPTZ is unambiguous.
CREATE TABLE user_sessions
(
    id             SERIAL PRIMARY KEY,
    user_id        INT  NOT NULL,
    session_key    TEXT NOT NULL UNIQUE,
    user_agent     TEXT,
    ip_address     VARCHAR(45),
    created_date   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_date   TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_user_sessions_user ON user_sessions (user_id);

-- Persistent security/audit log. Powers both a per-user "recent logins"
-- list (Settings > Security) and, later, an admin/audit view - kept
-- generic (entity_type/entity_id/metadata) so future data-change logging
-- (books, loans, ...) can reuse this same table instead of growing a new
-- one per feature. Only auth events (login/login_failed/logout/
-- password_changed) are written today - see utils/ActivityLog.ts.
CREATE TABLE activity_log
(
    id           BIGSERIAL PRIMARY KEY,
    actor_id     INT,
    action       VARCHAR(50) NOT NULL,
    entity_type  VARCHAR(50),
    entity_id    INT,
    metadata     JSONB,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL
);
CREATE INDEX idx_activity_log_actor_created ON activity_log (actor_id, created_date DESC);

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'USERCONF_SESSIONS', 'Active sessions'),
       ('en', 'USERCONF_SESSIONS_DESC', 'Devices currently signed in to your account.'),
       ('en', 'USERCONF_SESSIONS_EMPTY', 'No active sessions'),
       ('en', 'USERCONF_SESSION_CURRENT', 'This device'),
       ('en', 'USERCONF_SESSION_LOG_OUT', 'Log out'),
       ('en', 'USERCONF_SESSION_LAST_ACTIVE', 'Last active'),
       ('en', 'USERCONF_SESSION_LOGOUT_TITLE', 'Log out this device?'),
       ('en', 'USERCONF_SESSION_LOGOUT_DESC', 'This device will be signed out immediately.'),
       ('en', 'SNACKBAR_SESSION_REVOKED', 'Device signed out'),
       ('en', 'USERCONF_LOGIN_ACTIVITY', 'Recent logins'),
       ('en', 'USERCONF_LOGIN_ACTIVITY_DESC', 'The last sign-ins to your account.'),
       ('en', 'USERCONF_LOGIN_ACTIVITY_EMPTY', 'No login activity yet'),
       ('en', 'ACTIVITY_LOGIN', 'Signed in'),
       ('en', 'ACTIVITY_LOGIN_FAILED', 'Failed sign-in attempt'),
       ('en', 'ACTIVITY_LOGOUT', 'Signed out'),
       ('en', 'ACTIVITY_PASSWORD_CHANGED', 'Password changed'),
       ('en', 'DEVICE_UNKNOWN', 'Unknown device'),

       ('ca', 'USERCONF_SESSIONS', 'Sessions actives'),
       ('ca', 'USERCONF_SESSIONS_DESC', 'Dispositius que tenen la sessió iniciada al teu compte actualment.'),
       ('ca', 'USERCONF_SESSIONS_EMPTY', 'Cap sessió activa'),
       ('ca', 'USERCONF_SESSION_CURRENT', 'Aquest dispositiu'),
       ('ca', 'USERCONF_SESSION_LOG_OUT', 'Tanca la sessió'),
       ('ca', 'USERCONF_SESSION_LAST_ACTIVE', 'Última activitat'),
       ('ca', 'USERCONF_SESSION_LOGOUT_TITLE', 'Tancar la sessió d''aquest dispositiu?'),
       ('ca', 'USERCONF_SESSION_LOGOUT_DESC', 'Aquest dispositiu tancarà la sessió immediatament.'),
       ('ca', 'SNACKBAR_SESSION_REVOKED', 'Sessió del dispositiu tancada'),
       ('ca', 'USERCONF_LOGIN_ACTIVITY', 'Inicis de sessió recents'),
       ('ca', 'USERCONF_LOGIN_ACTIVITY_DESC', 'Els últims inicis de sessió del teu compte.'),
       ('ca', 'USERCONF_LOGIN_ACTIVITY_EMPTY', 'Encara no hi ha cap activitat d''inici de sessió'),
       ('ca', 'ACTIVITY_LOGIN', 'Sessió iniciada'),
       ('ca', 'ACTIVITY_LOGIN_FAILED', 'Intent d''inici de sessió fallit'),
       ('ca', 'ACTIVITY_LOGOUT', 'Sessió tancada'),
       ('ca', 'ACTIVITY_PASSWORD_CHANGED', 'Contrasenya canviada'),
       ('ca', 'DEVICE_UNKNOWN', 'Dispositiu desconegut'),

       ('es', 'USERCONF_SESSIONS', 'Sesiones activas'),
       ('es', 'USERCONF_SESSIONS_DESC', 'Dispositivos con la sesión iniciada actualmente en tu cuenta.'),
       ('es', 'USERCONF_SESSIONS_EMPTY', 'No hay sesiones activas'),
       ('es', 'USERCONF_SESSION_CURRENT', 'Este dispositivo'),
       ('es', 'USERCONF_SESSION_LOG_OUT', 'Cerrar sesión'),
       ('es', 'USERCONF_SESSION_LAST_ACTIVE', 'Última actividad'),
       ('es', 'USERCONF_SESSION_LOGOUT_TITLE', '¿Cerrar la sesión de este dispositivo?'),
       ('es', 'USERCONF_SESSION_LOGOUT_DESC', 'Este dispositivo cerrará sesión inmediatamente.'),
       ('es', 'SNACKBAR_SESSION_REVOKED', 'Sesión del dispositivo cerrada'),
       ('es', 'USERCONF_LOGIN_ACTIVITY', 'Inicios de sesión recientes'),
       ('es', 'USERCONF_LOGIN_ACTIVITY_DESC', 'Los últimos inicios de sesión de tu cuenta.'),
       ('es', 'USERCONF_LOGIN_ACTIVITY_EMPTY', 'Todavía no hay actividad de inicio de sesión'),
       ('es', 'ACTIVITY_LOGIN', 'Sesión iniciada'),
       ('es', 'ACTIVITY_LOGIN_FAILED', 'Intento de inicio de sesión fallido'),
       ('es', 'ACTIVITY_LOGOUT', 'Sesión cerrada'),
       ('es', 'ACTIVITY_PASSWORD_CHANGED', 'Contraseña cambiada'),
       ('es', 'DEVICE_UNKNOWN', 'Dispositivo desconocido'),

       ('it', 'USERCONF_SESSIONS', 'Sessioni attive'),
       ('it', 'USERCONF_SESSIONS_DESC', 'Dispositivi attualmente connessi al tuo account.'),
       ('it', 'USERCONF_SESSIONS_EMPTY', 'Nessuna sessione attiva'),
       ('it', 'USERCONF_SESSION_CURRENT', 'Questo dispositivo'),
       ('it', 'USERCONF_SESSION_LOG_OUT', 'Disconnetti'),
       ('it', 'USERCONF_SESSION_LAST_ACTIVE', 'Ultima attività'),
       ('it', 'USERCONF_SESSION_LOGOUT_TITLE', 'Disconnettere questo dispositivo?'),
       ('it', 'USERCONF_SESSION_LOGOUT_DESC', 'Questo dispositivo verrà disconnesso immediatamente.'),
       ('it', 'SNACKBAR_SESSION_REVOKED', 'Dispositivo disconnesso'),
       ('it', 'USERCONF_LOGIN_ACTIVITY', 'Accessi recenti'),
       ('it', 'USERCONF_LOGIN_ACTIVITY_DESC', 'Gli ultimi accessi al tuo account.'),
       ('it', 'USERCONF_LOGIN_ACTIVITY_EMPTY', 'Nessuna attività di accesso ancora'),
       ('it', 'ACTIVITY_LOGIN', 'Accesso effettuato'),
       ('it', 'ACTIVITY_LOGIN_FAILED', 'Tentativo di accesso fallito'),
       ('it', 'ACTIVITY_LOGOUT', 'Disconnesso'),
       ('it', 'ACTIVITY_PASSWORD_CHANGED', 'Password modificata'),
       ('it', 'DEVICE_UNKNOWN', 'Dispositivo sconosciuto');
