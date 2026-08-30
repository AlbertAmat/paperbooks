-- Adds a per-user UI theme preference ("beige" or "library").
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

ALTER TABLE users
    ADD COLUMN theme VARCHAR(10) NOT NULL DEFAULT 'beige' CHECK (theme IN ('beige', 'library'));

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'USERCONF_APPEARANCE', 'Appearance'),
       ('en', 'USERCONF_THEME_BEIGE', 'Reading Room'),
       ('en', 'USERCONF_THEME_BEIGE_DESC', 'Warm, light, and paper-toned.'),
       ('en', 'USERCONF_THEME_LIBRARY', 'Open Shelf'),
       ('en', 'USERCONF_THEME_LIBRARY_DESC', 'Dark, cool-toned, easy on the eyes at night.'),
       ('en', 'SNACKBAR_APPEARANCE_UPDATED', 'Appearance updated'),
       ('en', 'USERCONF_EMAIL_DESC', 'Used to sign in and for account notifications.'),

       ('ca', 'USERCONF_APPEARANCE', 'Aparença'),
       ('ca', 'USERCONF_THEME_BEIGE', 'Sala de lectura'),
       ('ca', 'USERCONF_THEME_BEIGE_DESC', 'Càlida, clara i amb tons de paper.'),
       ('ca', 'USERCONF_THEME_LIBRARY', 'Prestatge obert'),
       ('ca', 'USERCONF_THEME_LIBRARY_DESC', 'Fosc, en tons freds, còmode per als ulls de nit.'),
       ('ca', 'SNACKBAR_APPEARANCE_UPDATED', 'Aparença actualitzada'),
       ('ca', 'USERCONF_EMAIL_DESC', 'S''utilitza per iniciar sessió i per a notificacions del compte.'),

       ('es', 'USERCONF_APPEARANCE', 'Apariencia'),
       ('es', 'USERCONF_THEME_BEIGE', 'Sala de lectura'),
       ('es', 'USERCONF_THEME_BEIGE_DESC', 'Cálida, clara y con tonos de papel.'),
       ('es', 'USERCONF_THEME_LIBRARY', 'Estantería abierta'),
       ('es', 'USERCONF_THEME_LIBRARY_DESC', 'Oscuro, en tonos fríos, cómodo para los ojos de noche.'),
       ('es', 'SNACKBAR_APPEARANCE_UPDATED', 'Apariencia actualizada'),
       ('es', 'USERCONF_EMAIL_DESC', 'Se utiliza para iniciar sesión y para las notificaciones de la cuenta.'),

       ('it', 'USERCONF_APPEARANCE', 'Aspetto'),
       ('it', 'USERCONF_THEME_BEIGE', 'Sala lettura'),
       ('it', 'USERCONF_THEME_BEIGE_DESC', 'Caldo, chiaro e con toni carta.'),
       ('it', 'USERCONF_THEME_LIBRARY', 'Scaffale aperto'),
       ('it', 'USERCONF_THEME_LIBRARY_DESC', 'Scuro, toni freddi, riposante per gli occhi di sera.'),
       ('it', 'SNACKBAR_APPEARANCE_UPDATED', 'Aspetto aggiornato'),
       ('it', 'USERCONF_EMAIL_DESC', 'Usata per accedere e per le notifiche dell''account.');
