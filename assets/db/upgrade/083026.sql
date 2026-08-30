-- Consolidated migration for all schema changes made on 2026-08-30.
-- Brings an already-installed database in line with today's databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Per-user UI theme preference ("beige" or "library").
ALTER TABLE users
    ADD COLUMN theme VARCHAR(10) NOT NULL DEFAULT 'beige' CHECK (theme IN ('beige', 'library'));

-- Per-user preference for whether the left nav collapses to icon-only "rail"
-- mode (expanding on hover) instead of staying fully expanded. Off (expanded)
-- by default.
ALTER TABLE users
    ADD COLUMN sidebar_rail BOOLEAN NOT NULL DEFAULT FALSE;

-- The optional epub/pdf backup file per book: a personal copy kept in case
-- the user only has the file itself on an e-reader. One file per book
-- (UNIQUE book_id) - uploading a new one replaces the previous one.
CREATE TABLE book_files
(
    id           SERIAL PRIMARY KEY,
    book_id      INT UNIQUE                                      NOT NULL,
    user_id      INT                                             NOT NULL,
    file_type    VARCHAR(4) CHECK (file_type IN ('epub', 'pdf')) NOT NULL,
    file_name    VARCHAR(255)                                    NOT NULL,
    file_size    INT                                             NOT NULL,
    file_data    BYTEA                                           NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tracks when a book_stocks copy was last loaned out (set on lend, cleared
-- on return), so loans can be filtered/sorted by date on the new Loans
-- management view.
ALTER TABLE book_stocks
    ADD COLUMN loaned_at TIMESTAMP;

-- Best-effort backfill for copies already on loan, so existing loans show up
-- in date-filtered views instead of having a null loan date forever.
UPDATE book_stocks
SET loaned_at = NOW()
WHERE status = 2
  AND loaned_at IS NULL;

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'USERCONF_APPEARANCE', 'Appearance'),
       ('en', 'USERCONF_THEME_BEIGE', 'Reading Room'),
       ('en', 'USERCONF_THEME_BEIGE_DESC', 'Warm, light, and paper-toned.'),
       ('en', 'USERCONF_THEME_LIBRARY', 'Open Shelf'),
       ('en', 'USERCONF_THEME_LIBRARY_DESC', 'Dark, cool-toned, easy on the eyes at night.'),
       ('en', 'SNACKBAR_APPEARANCE_UPDATED', 'Appearance updated'),
       ('en', 'USERCONF_EMAIL_DESC', 'Used to sign in and for account notifications.'),
       ('en', 'USERCONF_COMPACT_MENU', 'Compact menu'),
       ('en', 'USERCONF_COMPACT_MENU_DESC', 'Collapse the sidebar to icons only, expanding it when you hover over it.'),
       ('en', 'DASHBOARD_HERO_PREFIX', 'You have'),
       ('en', 'DASHBOARD_HERO_SUFFIX', 'new books this month'),
       ('en', 'DASHBOARD_ALL_CATEGORIES', 'All'),
       ('en', 'EBOOK_FILE', 'Ebook file'),
       ('en', 'EBOOK_FILE_DRAG_AND_DROP', 'Drag and drop an epub or pdf'),
       ('en', 'EBOOK_FILE_HOVER_INFO', '(Backup copy in case you lose your e-reader)'),
       ('en', 'ONLY_EBOOK_FILES_ALLOWED', 'Only EPUB or PDF files are allowed'),
       ('en', 'FILE_TOO_LARGE', 'File is too large (max 100MB)'),
       ('en', 'DOWNLOAD', 'Download'),
       ('en', 'SNACKBAR_BOOK_FILE_UPLOADED', 'Ebook file uploaded'),
       ('en', 'SNACKBAR_BOOK_FILE_DELETED', 'Ebook file deleted'),
       ('en', 'DELETE_FILE', 'Delete file '),
       ('en', 'DELETE_FILE_DESC', 'Are you sure that you want to delete this ebook file?'),
       ('en', 'DASHBOARD_BROWSE_CATEGORIES', 'Browse by category'),
       ('en', 'DASHBOARD_ON_LOAN', 'Currently on loan'),
       ('en', 'DASHBOARD_LOANED_TO', 'Loaned to'),
       ('en', 'DASHBOARD_NO_LOANS', 'Nothing out right now'),
       ('en', 'LOANS', 'Loans'),
       ('en', 'LOANED_ON', 'Loaned on'),
       ('en', 'DATE_FROM', 'From'),
       ('en', 'DATE_TO', 'To'),
       ('en', 'ALL_GROUPS', 'All groups'),
       ('en', 'EMPTY_LOANS_TITLE', 'No books on loan'),
       ('en', 'EMPTY_LOANS_DESC', 'Books currently loaned to a customer will show up here.'),
       ('en', 'VIEW_ALL', 'View all'),
       ('en', 'DASHBOARD_LOANS_NOTE', 'Showing the 5 most recent loans'),

       ('ca', 'USERCONF_APPEARANCE', 'Aparença'),
       ('ca', 'USERCONF_THEME_BEIGE', 'Sala de lectura'),
       ('ca', 'USERCONF_THEME_BEIGE_DESC', 'Càlida, clara i amb tons de paper.'),
       ('ca', 'USERCONF_THEME_LIBRARY', 'Prestatge obert'),
       ('ca', 'USERCONF_THEME_LIBRARY_DESC', 'Fosc, en tons freds, còmode per als ulls de nit.'),
       ('ca', 'SNACKBAR_APPEARANCE_UPDATED', 'Aparença actualitzada'),
       ('ca', 'USERCONF_EMAIL_DESC', 'S''utilitza per iniciar sessió i per a notificacions del compte.'),
       ('ca', 'USERCONF_COMPACT_MENU', 'Menú compacte'),
       ('ca', 'USERCONF_COMPACT_MENU_DESC', 'Redueix la barra lateral a només icones, expandint-la en passar-hi el ratolí per sobre.'),
       ('ca', 'DASHBOARD_HERO_PREFIX', 'Tens'),
       ('ca', 'DASHBOARD_HERO_SUFFIX', 'llibres nous aquest mes'),
       ('ca', 'DASHBOARD_ALL_CATEGORIES', 'Tots'),
       ('ca', 'EBOOK_FILE', 'Fitxer digital'),
       ('ca', 'EBOOK_FILE_DRAG_AND_DROP', 'Arrossega i deixa anar un epub o pdf'),
       ('ca', 'EBOOK_FILE_HOVER_INFO', '(Còpia de seguretat per si perdeu el vostre lector electrònic)'),
       ('ca', 'ONLY_EBOOK_FILES_ALLOWED', 'Només es permeten fitxers EPUB o PDF'),
       ('ca', 'FILE_TOO_LARGE', 'El fitxer és massa gran (màxim 100MB)'),
       ('ca', 'DOWNLOAD', 'Descarregar'),
       ('ca', 'SNACKBAR_BOOK_FILE_UPLOADED', 'S’ha pujat el fitxer digital'),
       ('ca', 'SNACKBAR_BOOK_FILE_DELETED', 'S’ha eliminat el fitxer digital'),
       ('ca', 'DELETE_FILE', 'Eliminar fitxer '),
       ('ca', 'DELETE_FILE_DESC', 'Segur que voleu eliminar aquest fitxer digital?'),
       ('ca', 'DASHBOARD_BROWSE_CATEGORIES', 'Explora per categoria'),
       ('ca', 'DASHBOARD_ON_LOAN', 'Actualment en préstec'),
       ('ca', 'DASHBOARD_LOANED_TO', 'En préstec a'),
       ('ca', 'DASHBOARD_NO_LOANS', 'Ara mateix no hi ha res prestat'),
       ('ca', 'LOANS', 'Préstecs'),
       ('ca', 'LOANED_ON', 'Prestat el'),
       ('ca', 'DATE_FROM', 'Des de'),
       ('ca', 'DATE_TO', 'Fins a'),
       ('ca', 'ALL_GROUPS', 'Tots els grups'),
       ('ca', 'EMPTY_LOANS_TITLE', 'Cap llibre en préstec'),
       ('ca', 'EMPTY_LOANS_DESC', 'Els llibres actualment prestats a un client apareixeran aquí.'),
       ('ca', 'VIEW_ALL', 'Veure-ho tot'),
       ('ca', 'DASHBOARD_LOANS_NOTE', 'Es mostren els 5 préstecs més recents'),

       ('es', 'USERCONF_APPEARANCE', 'Apariencia'),
       ('es', 'USERCONF_THEME_BEIGE', 'Sala de lectura'),
       ('es', 'USERCONF_THEME_BEIGE_DESC', 'Cálida, clara y con tonos de papel.'),
       ('es', 'USERCONF_THEME_LIBRARY', 'Estantería abierta'),
       ('es', 'USERCONF_THEME_LIBRARY_DESC', 'Oscuro, en tonos fríos, cómodo para los ojos de noche.'),
       ('es', 'SNACKBAR_APPEARANCE_UPDATED', 'Apariencia actualizada'),
       ('es', 'USERCONF_EMAIL_DESC', 'Se utiliza para iniciar sesión y para las notificaciones de la cuenta.'),
       ('es', 'USERCONF_COMPACT_MENU', 'Menú compacto'),
       ('es', 'USERCONF_COMPACT_MENU_DESC', 'Reduce la barra lateral a solo iconos, expandiéndola al pasar el ratón por encima.'),
       ('es', 'DASHBOARD_HERO_PREFIX', 'Tienes'),
       ('es', 'DASHBOARD_HERO_SUFFIX', 'libros nuevos este mes'),
       ('es', 'DASHBOARD_ALL_CATEGORIES', 'Todos'),
       ('es', 'EBOOK_FILE', 'Archivo digital'),
       ('es', 'EBOOK_FILE_DRAG_AND_DROP', 'Arrastra y suelta un epub o pdf'),
       ('es', 'EBOOK_FILE_HOVER_INFO', '(Copia de seguridad por si pierdes tu lector electrónico)'),
       ('es', 'ONLY_EBOOK_FILES_ALLOWED', 'Solo se permiten archivos EPUB o PDF'),
       ('es', 'FILE_TOO_LARGE', 'El archivo es demasiado grande (máximo 100MB)'),
       ('es', 'DOWNLOAD', 'Descargar'),
       ('es', 'SNACKBAR_BOOK_FILE_UPLOADED', 'Se ha subido el archivo digital'),
       ('es', 'SNACKBAR_BOOK_FILE_DELETED', 'Se ha eliminado el archivo digital'),
       ('es', 'DELETE_FILE', 'Eliminar archivo '),
       ('es', 'DELETE_FILE_DESC', '¿Está seguro de que desea eliminar este archivo digital?'),
       ('es', 'DASHBOARD_BROWSE_CATEGORIES', 'Explora por categoría'),
       ('es', 'DASHBOARD_ON_LOAN', 'Actualmente en préstamo'),
       ('es', 'DASHBOARD_LOANED_TO', 'Prestado a'),
       ('es', 'DASHBOARD_NO_LOANS', 'Ahora mismo no hay nada prestado'),
       ('es', 'LOANS', 'Préstamos'),
       ('es', 'LOANED_ON', 'Prestado el'),
       ('es', 'DATE_FROM', 'Desde'),
       ('es', 'DATE_TO', 'Hasta'),
       ('es', 'ALL_GROUPS', 'Todos los grupos'),
       ('es', 'EMPTY_LOANS_TITLE', 'Ningún libro en préstamo'),
       ('es', 'EMPTY_LOANS_DESC', 'Los libros actualmente prestados a un cliente aparecerán aquí.'),
       ('es', 'VIEW_ALL', 'Ver todo'),
       ('es', 'DASHBOARD_LOANS_NOTE', 'Se muestran los 5 préstamos más recientes'),

       ('it', 'USERCONF_APPEARANCE', 'Aspetto'),
       ('it', 'USERCONF_THEME_BEIGE', 'Sala lettura'),
       ('it', 'USERCONF_THEME_BEIGE_DESC', 'Caldo, chiaro e con toni carta.'),
       ('it', 'USERCONF_THEME_LIBRARY', 'Scaffale aperto'),
       ('it', 'USERCONF_THEME_LIBRARY_DESC', 'Scuro, toni freddi, riposante per gli occhi di sera.'),
       ('it', 'SNACKBAR_APPEARANCE_UPDATED', 'Aspetto aggiornato'),
       ('it', 'USERCONF_EMAIL_DESC', 'Usata per accedere e per le notifiche dell''account.'),
       ('it', 'USERCONF_COMPACT_MENU', 'Menu compatto'),
       ('it', 'USERCONF_COMPACT_MENU_DESC', 'Riduci la barra laterale alle sole icone, espandendola al passaggio del mouse.'),
       ('it', 'DASHBOARD_HERO_PREFIX', 'Hai'),
       ('it', 'DASHBOARD_HERO_SUFFIX', 'nuovi libri questo mese'),
       ('it', 'DASHBOARD_ALL_CATEGORIES', 'Tutti'),
       ('it', 'EBOOK_FILE', 'File digitale'),
       ('it', 'EBOOK_FILE_DRAG_AND_DROP', 'Trascina e rilascia un epub o pdf'),
       ('it', 'EBOOK_FILE_HOVER_INFO', '(Copia di backup nel caso perdessi il tuo e-reader)'),
       ('it', 'ONLY_EBOOK_FILES_ALLOWED', 'Sono consentiti solo file EPUB o PDF'),
       ('it', 'FILE_TOO_LARGE', 'Il file è troppo grande (massimo 100MB)'),
       ('it', 'DOWNLOAD', 'Scarica'),
       ('it', 'SNACKBAR_BOOK_FILE_UPLOADED', 'File digitale caricato'),
       ('it', 'SNACKBAR_BOOK_FILE_DELETED', 'File digitale eliminato'),
       ('it', 'DELETE_FILE', 'Elimina file '),
       ('it', 'DELETE_FILE_DESC', 'Sei sicuro di voler eliminare questo file digitale?'),
       ('it', 'DASHBOARD_BROWSE_CATEGORIES', 'Sfoglia per categoria'),
       ('it', 'DASHBOARD_ON_LOAN', 'Attualmente in prestito'),
       ('it', 'DASHBOARD_LOANED_TO', 'In prestito a'),
       ('it', 'DASHBOARD_NO_LOANS', 'Al momento non c''è nulla in prestito'),
       ('it', 'LOANS', 'Prestiti'),
       ('it', 'LOANED_ON', 'Prestato il'),
       ('it', 'DATE_FROM', 'Da'),
       ('it', 'DATE_TO', 'A'),
       ('it', 'ALL_GROUPS', 'Tutti i gruppi'),
       ('it', 'EMPTY_LOANS_TITLE', 'Nessun libro in prestito'),
       ('it', 'EMPTY_LOANS_DESC', 'I libri attualmente prestati a un cliente appariranno qui.'),
       ('it', 'VIEW_ALL', 'Vedi tutto'),
       ('it', 'DASHBOARD_LOANS_NOTE', 'Vengono mostrati i 5 prestiti più recenti');
