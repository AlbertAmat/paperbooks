-- Upgrade to v1.0.2 - schema changes made on 2026-09-01.
-- Brings an already-installed database in line with the v1.0.2 databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Rebrand: the account-deletion confirmation text still says "Paper Books" on
-- any database seeded before today. Bring it in line with the new brand name.
-- Also drops a stray literal `"` before the closing quote in the English row,
-- a pre-existing typo carried over from the original text.
UPDATE app_labels SET text = 'Are you sure you want to delete your Vaultisse account? This will permanently remove your account and all associated content.'
    WHERE language = 'en' AND code = 'USERCONF_DELETE_USER_DESC';
UPDATE app_labels SET text = 'Segur que voleu eliminar el vostre compte de Vaultisse? Això eliminarà permanentment el compte i tot el contingut associat.'
    WHERE language = 'ca' AND code = 'USERCONF_DELETE_USER_DESC';
UPDATE app_labels SET text = '¿Está seguro de que desea eliminar su cuenta de Vaultisse? Esto eliminará permanentemente su cuenta y todo el contenido asociado.'
    WHERE language = 'es' AND code = 'USERCONF_DELETE_USER_DESC';
UPDATE app_labels SET text = 'Sei sicuro di voler eliminare il tuo account Vaultisse? Questo rimuoverà permanentemente l’account e tutti i contenuti associati.'
    WHERE language = 'it' AND code = 'USERCONF_DELETE_USER_DESC';
