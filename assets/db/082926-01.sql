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
