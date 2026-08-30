-- Adds a per-user preference for whether the left nav collapses to icon-only
-- "rail" mode (expanding on hover) instead of staying fully expanded. Off
-- (expanded) by default.
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

ALTER TABLE users
    ADD COLUMN sidebar_rail BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'USERCONF_COMPACT_MENU', 'Compact menu'),
       ('en', 'USERCONF_COMPACT_MENU_DESC', 'Collapse the sidebar to icons only, expanding it when you hover over it.'),

       ('ca', 'USERCONF_COMPACT_MENU', 'Menú compacte'),
       ('ca', 'USERCONF_COMPACT_MENU_DESC', 'Redueix la barra lateral a només icones, expandint-la en passar-hi el ratolí per sobre.'),

       ('es', 'USERCONF_COMPACT_MENU', 'Menú compacto'),
       ('es', 'USERCONF_COMPACT_MENU_DESC', 'Reduce la barra lateral a solo iconos, expandiéndola al pasar el ratón por encima.'),

       ('it', 'USERCONF_COMPACT_MENU', 'Menu compatto'),
       ('it', 'USERCONF_COMPACT_MENU_DESC', 'Riduci la barra laterale alle sole icone, espandendola al passaggio del mouse.');
