-- Consolidated migration for all schema changes made on 2026-08-29.
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Customer groups: manage/add/edit/delete UI labels + drag-and-drop move labels
INSERT INTO app_labels (language, code, text)
VALUES ('en', 'GROUPS', 'Groups'),
       ('en', 'GROUP', 'Group'),
       ('en', 'NO_GROUP', 'No group'),
       ('en', 'NO_MEMBERS', 'No members'),
       ('en', 'MANAGE_GROUPS', 'Manage groups'),
       ('en', 'ADD_GROUP', 'Add group'),
       ('en', 'EDIT_GROUP', 'Edit group'),
       ('en', 'DELETE_GROUP', 'Delete group'),
       ('en', 'DELETE_GROUP_DESC', 'Are you sure that you want to remove this group? Customers in this group will not be deleted.'),
       ('en', 'GROUP_MEMBERS', 'Group members'),
       ('en', 'ADD_MEMBERS_TO_GROUP', 'Add members'),
       ('en', 'TOTAL_CUSTOMERS', 'Customers'),
       ('en', 'SNACKBAR_NEW_GROUP_ADDED', 'Group added'),
       ('en', 'SNACKBAR_GROUP_UPDATED', 'Group updated'),
       ('en', 'SNACKBAR_DELETED_GROUP', 'Group deleted'),
       ('en', 'MOVE_TO_GROUP', 'Move to group'),
       ('en', 'MOVE', 'Move'),
       ('en', 'SELECTED', 'selected'),
       ('en', 'GROUPS_DRAG_DROP_HINT', 'Drag and drop customers between groups, or select multiple to move them at once.'),

       ('ca', 'GROUPS', 'Grups'),
       ('ca', 'GROUP', 'Grup'),
       ('ca', 'NO_GROUP', 'Sense grup'),
       ('ca', 'NO_MEMBERS', 'Sense membres'),
       ('ca', 'MANAGE_GROUPS', 'Gestionar grups'),
       ('ca', 'ADD_GROUP', 'Afegir grup'),
       ('ca', 'EDIT_GROUP', 'Editar grup'),
       ('ca', 'DELETE_GROUP', 'Eliminar grup'),
       ('ca', 'DELETE_GROUP_DESC', 'Segur que voleu eliminar aquest grup? Els clients d''aquest grup no s''eliminaran.'),
       ('ca', 'GROUP_MEMBERS', 'Membres del grup'),
       ('ca', 'ADD_MEMBERS_TO_GROUP', 'Afegir membres'),
       ('ca', 'TOTAL_CUSTOMERS', 'Clients'),
       ('ca', 'SNACKBAR_NEW_GROUP_ADDED', 'Grup afegit'),
       ('ca', 'SNACKBAR_GROUP_UPDATED', 'Grup actualitzat'),
       ('ca', 'SNACKBAR_DELETED_GROUP', 'Grup eliminat'),
       ('ca', 'MOVE_TO_GROUP', 'Moure al grup'),
       ('ca', 'MOVE', 'Moure'),
       ('ca', 'SELECTED', 'seleccionats'),
       ('ca', 'GROUPS_DRAG_DROP_HINT', 'Arrossega els clients entre grups, o selecciona''n diversos per moure''ls alhora.'),

       ('es', 'GROUPS', 'Grupos'),
       ('es', 'GROUP', 'Grupo'),
       ('es', 'NO_GROUP', 'Sin grupo'),
       ('es', 'NO_MEMBERS', 'Sin miembros'),
       ('es', 'MANAGE_GROUPS', 'Gestionar grupos'),
       ('es', 'ADD_GROUP', 'Agregar grupo'),
       ('es', 'EDIT_GROUP', 'Editar grupo'),
       ('es', 'DELETE_GROUP', 'Eliminar grupo'),
       ('es', 'DELETE_GROUP_DESC', '¿Está seguro de que desea eliminar este grupo? Los clientes de este grupo no se eliminarán.'),
       ('es', 'GROUP_MEMBERS', 'Miembros del grupo'),
       ('es', 'ADD_MEMBERS_TO_GROUP', 'Agregar miembros'),
       ('es', 'TOTAL_CUSTOMERS', 'Clientes'),
       ('es', 'SNACKBAR_NEW_GROUP_ADDED', 'Grupo agregado'),
       ('es', 'SNACKBAR_GROUP_UPDATED', 'Grupo actualizado'),
       ('es', 'SNACKBAR_DELETED_GROUP', 'Grupo eliminado'),
       ('es', 'MOVE_TO_GROUP', 'Mover al grupo'),
       ('es', 'MOVE', 'Mover'),
       ('es', 'SELECTED', 'seleccionados'),
       ('es', 'GROUPS_DRAG_DROP_HINT', 'Arrastra los clientes entre grupos, o selecciona varios para moverlos a la vez.'),

       ('it', 'GROUPS', 'Gruppi'),
       ('it', 'GROUP', 'Gruppo'),
       ('it', 'NO_GROUP', 'Nessun gruppo'),
       ('it', 'NO_MEMBERS', 'Nessun membro'),
       ('it', 'MANAGE_GROUPS', 'Gestisci gruppi'),
       ('it', 'ADD_GROUP', 'Aggiungi gruppo'),
       ('it', 'EDIT_GROUP', 'Modifica gruppo'),
       ('it', 'DELETE_GROUP', 'Elimina gruppo'),
       ('it', 'DELETE_GROUP_DESC', 'Sei sicuro di voler rimuovere questo gruppo? I clienti di questo gruppo non verranno eliminati.'),
       ('it', 'GROUP_MEMBERS', 'Membri del gruppo'),
       ('it', 'ADD_MEMBERS_TO_GROUP', 'Aggiungi membri'),
       ('it', 'TOTAL_CUSTOMERS', 'Clienti'),
       ('it', 'SNACKBAR_NEW_GROUP_ADDED', 'Gruppo aggiunto'),
       ('it', 'SNACKBAR_GROUP_UPDATED', 'Gruppo aggiornato'),
       ('it', 'SNACKBAR_DELETED_GROUP', 'Gruppo eliminato'),
       ('it', 'MOVE_TO_GROUP', 'Sposta nel gruppo'),
       ('it', 'MOVE', 'Sposta'),
       ('it', 'SELECTED', 'selezionati'),
       ('it', 'GROUPS_DRAG_DROP_HINT', 'Trascina i clienti tra i gruppi, oppure selezionane più di uno per spostarli insieme.');

-- Empty states: library, locations, customers, categories, authors, dashboard
INSERT INTO app_labels (language, code, text)
VALUES ('en', 'EMPTY_LIBRARY_TITLE', 'Add your first book'),
       ('en', 'EMPTY_LIBRARY_DESC', 'Scan an ISBN or add a book manually to start building your library.'),
       ('en', 'EMPTY_LOCATIONS_TITLE', 'Add your first location'),
       ('en', 'EMPTY_LOCATIONS_DESC', 'Create shelves, rooms or branches to organize where your books live.'),
       ('en', 'EMPTY_CUSTOMERS_TITLE', 'Add your first customer'),
       ('en', 'EMPTY_CUSTOMERS_DESC', 'Add customers to start lending and tracking your books.'),
       ('en', 'EMPTY_CATEGORIES_TITLE', 'Add your first category'),
       ('en', 'EMPTY_CATEGORIES_DESC', 'Create categories to organize and classify your books.'),
       ('en', 'EMPTY_AUTHORS_TITLE', 'Add your first author'),
       ('en', 'EMPTY_AUTHORS_DESC', 'Add authors to link them to the books in your library.'),
       ('en', 'EMPTY_LAST_BOOKS_TITLE', 'No books yet'),
       ('en', 'EMPTY_LAST_BOOKS_DESC', 'Books you add will show up here.'),

       ('ca', 'EMPTY_LIBRARY_TITLE', 'Afegeix el teu primer llibre'),
       ('ca', 'EMPTY_LIBRARY_DESC', 'Escaneja un ISBN o afegeix un llibre manualment per començar a construir la teva biblioteca.'),
       ('ca', 'EMPTY_LOCATIONS_TITLE', 'Afegeix la teva primera ubicació'),
       ('ca', 'EMPTY_LOCATIONS_DESC', 'Crea prestatges, sales o sucursals per organitzar on viuen els teus llibres.'),
       ('ca', 'EMPTY_CUSTOMERS_TITLE', 'Afegeix el teu primer client'),
       ('ca', 'EMPTY_CUSTOMERS_DESC', 'Afegeix clients per començar a prestar i fer seguiment dels teus llibres.'),
       ('ca', 'EMPTY_CATEGORIES_TITLE', 'Afegeix la teva primera categoria'),
       ('ca', 'EMPTY_CATEGORIES_DESC', 'Crea categories per organitzar i classificar els teus llibres.'),
       ('ca', 'EMPTY_AUTHORS_TITLE', 'Afegeix el teu primer autor'),
       ('ca', 'EMPTY_AUTHORS_DESC', 'Afegeix autors per vincular-los als llibres de la teva biblioteca.'),
       ('ca', 'EMPTY_LAST_BOOKS_TITLE', 'Encara no hi ha llibres'),
       ('ca', 'EMPTY_LAST_BOOKS_DESC', 'Els llibres que afegeixis apareixeran aquí.'),

       ('es', 'EMPTY_LIBRARY_TITLE', 'Agrega tu primer libro'),
       ('es', 'EMPTY_LIBRARY_DESC', 'Escanea un ISBN o agrega un libro manualmente para empezar a construir tu biblioteca.'),
       ('es', 'EMPTY_LOCATIONS_TITLE', 'Agrega tu primera ubicación'),
       ('es', 'EMPTY_LOCATIONS_DESC', 'Crea estanterías, salas o sucursales para organizar dónde viven tus libros.'),
       ('es', 'EMPTY_CUSTOMERS_TITLE', 'Agrega tu primer cliente'),
       ('es', 'EMPTY_CUSTOMERS_DESC', 'Agrega clientes para empezar a prestar y hacer seguimiento de tus libros.'),
       ('es', 'EMPTY_CATEGORIES_TITLE', 'Agrega tu primera categoría'),
       ('es', 'EMPTY_CATEGORIES_DESC', 'Crea categorías para organizar y clasificar tus libros.'),
       ('es', 'EMPTY_AUTHORS_TITLE', 'Agrega tu primer autor'),
       ('es', 'EMPTY_AUTHORS_DESC', 'Agrega autores para vincularlos a los libros de tu biblioteca.'),
       ('es', 'EMPTY_LAST_BOOKS_TITLE', 'Aún no hay libros'),
       ('es', 'EMPTY_LAST_BOOKS_DESC', 'Los libros que agregues aparecerán aquí.'),

       ('it', 'EMPTY_LIBRARY_TITLE', 'Aggiungi il tuo primo libro'),
       ('it', 'EMPTY_LIBRARY_DESC', 'Scansiona un ISBN o aggiungi un libro manualmente per iniziare a costruire la tua biblioteca.'),
       ('it', 'EMPTY_LOCATIONS_TITLE', 'Aggiungi la tua prima posizione'),
       ('it', 'EMPTY_LOCATIONS_DESC', 'Crea scaffali, stanze o filiali per organizzare dove si trovano i tuoi libri.'),
       ('it', 'EMPTY_CUSTOMERS_TITLE', 'Aggiungi il tuo primo cliente'),
       ('it', 'EMPTY_CUSTOMERS_DESC', 'Aggiungi clienti per iniziare a prestare e tenere traccia dei tuoi libri.'),
       ('it', 'EMPTY_CATEGORIES_TITLE', 'Aggiungi la tua prima categoria'),
       ('it', 'EMPTY_CATEGORIES_DESC', 'Crea categorie per organizzare e classificare i tuoi libri.'),
       ('it', 'EMPTY_AUTHORS_TITLE', 'Aggiungi il tuo primo autore'),
       ('it', 'EMPTY_AUTHORS_DESC', 'Aggiungi autori per collegarli ai libri della tua biblioteca.'),
       ('it', 'EMPTY_LAST_BOOKS_TITLE', 'Nessun libro ancora'),
       ('it', 'EMPTY_LAST_BOOKS_DESC', 'I libri che aggiungi appariranno qui.');

-- ISBN add-flow fix: missing "not found" / generic error labels
INSERT INTO app_labels (language, code, text)
VALUES ('en', 'ISBN_BOOK_NOT_FOUND', 'Book not found'),
       ('en', 'ISBN_ADD_ERROR', 'Error while adding the book'),

       ('ca', 'ISBN_BOOK_NOT_FOUND', 'Llibre no trobat'),
       ('ca', 'ISBN_ADD_ERROR', 'Error en afegir el llibre'),

       ('es', 'ISBN_BOOK_NOT_FOUND', 'Libro no encontrado'),
       ('es', 'ISBN_ADD_ERROR', 'Error al añadir el libro'),

       ('it', 'ISBN_BOOK_NOT_FOUND', 'Libro non trovato'),
       ('it', 'ISBN_ADD_ERROR', 'Errore durante l’aggiunta del libro');

-- Public institution accounts: manually-set flag + sensitive-data warning shown
-- in the customer/group dialogs. Not editable from the app.
ALTER TABLE users
    ADD COLUMN is_public_institution BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'PUBLIC_INSTITUTION_SENSITIVE_DATA_WARNING',
        'This account is registered as a public institution. Avoid entering sensitive personal information here — use student codes or IDs that only you can identify instead of full names.'),

       ('ca', 'PUBLIC_INSTITUTION_SENSITIVE_DATA_WARNING',
        'Aquest compte està registrat com a institució pública. Evita introduir informació personal sensible aquí: utilitza codis o identificadors de l''alumnat que només tu puguis reconèixer, en lloc de noms complets.'),

       ('es', 'PUBLIC_INSTITUTION_SENSITIVE_DATA_WARNING',
        'Esta cuenta está registrada como institución pública. Evita introducir información personal sensible aquí: usa códigos o identificadores de alumnos que solo tú puedas reconocer, en lugar de nombres completos.'),

       ('it', 'PUBLIC_INSTITUTION_SENSITIVE_DATA_WARNING',
        'Questo account è registrato come istituzione pubblica. Evita di inserire qui informazioni personali sensibili: usa codici o identificativi degli studenti che solo tu possa riconoscere, invece dei nomi completi.');

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

-- Adds tracking for the public-institution security-measures notice shown
-- after login (see SecurityNoticeDialog.vue).
CREATE TABLE user_security_notice_acknowledgements
(
    id            SERIAL PRIMARY KEY,
    user_id       INT       NOT NULL UNIQUE,
    sent_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Adds TOTP-based two-factor authentication support.
ALTER TABLE users
    ADD COLUMN totp_secret  TEXT,
    ADD COLUMN totp_enabled BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE user_backup_codes
(
    id           SERIAL PRIMARY KEY,
    user_id      INT       NOT NULL,
    code_hash    TEXT      NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used_date    TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'TWOFA_TITLE', 'Two-factor authentication'),
       ('en', 'TWOFA_DESC', 'Require a code from an authenticator app when signing in.'),
       ('en', 'TWOFA_STATUS_ENABLED', 'Enabled'),
       ('en', 'TWOFA_STATUS_DISABLED', 'Disabled'),
       ('en', 'TWOFA_ENABLE', 'Enable'),
       ('en', 'TWOFA_DISABLE', 'Disable'),
       ('en', 'TWOFA_SETUP_TITLE', 'Set up two-factor authentication'),
       ('en', 'TWOFA_SETUP_SCAN_DESC', 'Scan this QR code with an authenticator app (Google Authenticator, Authy, 1Password, ...), then enter the 6-digit code it shows.'),
       ('en', 'TWOFA_SETUP_MANUAL_KEY', 'Or enter this key manually:'),
       ('en', 'TWOFA_CODE', 'Verification code'),
       ('en', 'TWOFA_INVALID_CODE', 'Invalid code. Please try again.'),
       ('en', 'TWOFA_BACKUP_CODES_TITLE', 'Save your backup codes'),
       ('en', 'TWOFA_BACKUP_CODES_DESC', 'Each code can be used once to sign in if you lose access to your authenticator app. Store them somewhere safe - they won''t be shown again.'),
       ('en', 'TWOFA_SAVED_CODES_CONFIRM', 'I''ve saved these codes'),
       ('en', 'TWOFA_DISABLE_TITLE', 'Disable two-factor authentication'),
       ('en', 'TWOFA_DISABLE_DESC', 'Enter your password to disable two-factor authentication. Your backup codes will stop working.'),
       ('en', 'TWOFA_DISABLE_PASSWORD', 'Password'),
       ('en', 'TWOFA_ENABLED_SNACKBAR', 'Two-factor authentication enabled'),
       ('en', 'TWOFA_DISABLED_SNACKBAR', 'Two-factor authentication disabled'),

       ('ca', 'TWOFA_TITLE', 'Autenticació de dos factors'),
       ('ca', 'TWOFA_DESC', 'Exigeix un codi d''una aplicació autenticadora en iniciar sessió.'),
       ('ca', 'TWOFA_STATUS_ENABLED', 'Activada'),
       ('ca', 'TWOFA_STATUS_DISABLED', 'Desactivada'),
       ('ca', 'TWOFA_ENABLE', 'Activar'),
       ('ca', 'TWOFA_DISABLE', 'Desactivar'),
       ('ca', 'TWOFA_SETUP_TITLE', 'Configurar l''autenticació de dos factors'),
       ('ca', 'TWOFA_SETUP_SCAN_DESC', 'Escanegeu aquest codi QR amb una aplicació autenticadora (Google Authenticator, Authy, 1Password...) i després introduïu el codi de 6 xifres que mostri.'),
       ('ca', 'TWOFA_SETUP_MANUAL_KEY', 'O introduïu aquesta clau manualment:'),
       ('ca', 'TWOFA_CODE', 'Codi de verificació'),
       ('ca', 'TWOFA_INVALID_CODE', 'Codi no vàlid. Torneu-ho a provar.'),
       ('ca', 'TWOFA_BACKUP_CODES_TITLE', 'Deseu els vostres codis de seguretat'),
       ('ca', 'TWOFA_BACKUP_CODES_DESC', 'Cada codi es pot fer servir una vegada per iniciar sessió si perdeu l''accés a la vostra aplicació autenticadora. Deseu-los en un lloc segur - no es tornaran a mostrar.'),
       ('ca', 'TWOFA_SAVED_CODES_CONFIRM', 'He desat aquests codis'),
       ('ca', 'TWOFA_DISABLE_TITLE', 'Desactivar l''autenticació de dos factors'),
       ('ca', 'TWOFA_DISABLE_DESC', 'Introduïu la vostra contrasenya per desactivar l''autenticació de dos factors. Els vostres codis de seguretat deixaran de funcionar.'),
       ('ca', 'TWOFA_DISABLE_PASSWORD', 'Contrasenya'),
       ('ca', 'TWOFA_ENABLED_SNACKBAR', 'Autenticació de dos factors activada'),
       ('ca', 'TWOFA_DISABLED_SNACKBAR', 'Autenticació de dos factors desactivada'),

       ('es', 'TWOFA_TITLE', 'Autenticación de dos factores'),
       ('es', 'TWOFA_DESC', 'Exige un código de una aplicación autenticadora al iniciar sesión.'),
       ('es', 'TWOFA_STATUS_ENABLED', 'Activada'),
       ('es', 'TWOFA_STATUS_DISABLED', 'Desactivada'),
       ('es', 'TWOFA_ENABLE', 'Activar'),
       ('es', 'TWOFA_DISABLE', 'Desactivar'),
       ('es', 'TWOFA_SETUP_TITLE', 'Configurar la autenticación de dos factores'),
       ('es', 'TWOFA_SETUP_SCAN_DESC', 'Escanea este código QR con una aplicación autenticadora (Google Authenticator, Authy, 1Password...) y luego introduce el código de 6 dígitos que muestre.'),
       ('es', 'TWOFA_SETUP_MANUAL_KEY', 'O introduce esta clave manualmente:'),
       ('es', 'TWOFA_CODE', 'Código de verificación'),
       ('es', 'TWOFA_INVALID_CODE', 'Código no válido. Inténtalo de nuevo.'),
       ('es', 'TWOFA_BACKUP_CODES_TITLE', 'Guarda tus códigos de respaldo'),
       ('es', 'TWOFA_BACKUP_CODES_DESC', 'Cada código se puede usar una vez para iniciar sesión si pierdes el acceso a tu aplicación autenticadora. Guárdalos en un lugar seguro - no se volverán a mostrar.'),
       ('es', 'TWOFA_SAVED_CODES_CONFIRM', 'He guardado estos códigos'),
       ('es', 'TWOFA_DISABLE_TITLE', 'Desactivar la autenticación de dos factores'),
       ('es', 'TWOFA_DISABLE_DESC', 'Introduce tu contraseña para desactivar la autenticación de dos factores. Tus códigos de respaldo dejarán de funcionar.'),
       ('es', 'TWOFA_DISABLE_PASSWORD', 'Contraseña'),
       ('es', 'TWOFA_ENABLED_SNACKBAR', 'Autenticación de dos factores activada'),
       ('es', 'TWOFA_DISABLED_SNACKBAR', 'Autenticación de dos factores desactivada'),

       ('it', 'TWOFA_TITLE', 'Autenticazione a due fattori'),
       ('it', 'TWOFA_DESC', 'Richiedi un codice da un''app di autenticazione per accedere.'),
       ('it', 'TWOFA_STATUS_ENABLED', 'Attiva'),
       ('it', 'TWOFA_STATUS_DISABLED', 'Disattivata'),
       ('it', 'TWOFA_ENABLE', 'Attiva'),
       ('it', 'TWOFA_DISABLE', 'Disattiva'),
       ('it', 'TWOFA_SETUP_TITLE', 'Configura l''autenticazione a due fattori'),
       ('it', 'TWOFA_SETUP_SCAN_DESC', 'Scansiona questo codice QR con un''app di autenticazione (Google Authenticator, Authy, 1Password...), poi inserisci il codice a 6 cifre mostrato.'),
       ('it', 'TWOFA_SETUP_MANUAL_KEY', 'Oppure inserisci questa chiave manualmente:'),
       ('it', 'TWOFA_CODE', 'Codice di verifica'),
       ('it', 'TWOFA_INVALID_CODE', 'Codice non valido. Riprova.'),
       ('it', 'TWOFA_BACKUP_CODES_TITLE', 'Salva i tuoi codici di backup'),
       ('it', 'TWOFA_BACKUP_CODES_DESC', 'Ogni codice può essere usato una sola volta per accedere se perdi l''accesso alla tua app di autenticazione. Conservali in un luogo sicuro - non verranno mostrati di nuovo.'),
       ('it', 'TWOFA_SAVED_CODES_CONFIRM', 'Ho salvato questi codici'),
       ('it', 'TWOFA_DISABLE_TITLE', 'Disattiva l''autenticazione a due fattori'),
       ('it', 'TWOFA_DISABLE_DESC', 'Inserisci la tua password per disattivare l''autenticazione a due fattori. I tuoi codici di backup smetteranno di funzionare.'),
       ('it', 'TWOFA_DISABLE_PASSWORD', 'Password'),
       ('it', 'TWOFA_ENABLED_SNACKBAR', 'Autenticazione a due fattori attivata'),
       ('it', 'TWOFA_DISABLED_SNACKBAR', 'Autenticazione a due fattori disattivata');
