-- Upgrade to v1.1.0 (2 of 2) - schema changes made on 2026-09-05.
-- Brings an already-installed database in line with the v1.1.0 databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Allow a book to have multiple backed-up ebook files at once - one per
-- type (epub/pdf/mobi) instead of a single file overall. `mobi` is also
-- used for the .azw3 Kindle format, which shares the same MOBI/KF8
-- container and magic bytes. Uploading a file still replaces any existing
-- file of that same type, it just no longer displaces files of other types.
ALTER TABLE book_files
    DROP CONSTRAINT book_files_book_id_key,
    ADD CONSTRAINT book_files_book_id_file_type_key UNIQUE (book_id, file_type);

ALTER TABLE book_files
    DROP CONSTRAINT book_files_file_type_check,
    ADD CONSTRAINT book_files_file_type_check CHECK (file_type IN ('epub', 'pdf', 'mobi'));

INSERT INTO app_labels (language, code, text)
VALUES ('en', 'ADD_FILE', 'Add file'),
       ('en', 'FULLSCREEN', 'Fullscreen'),
       ('en', 'EXIT_FULLSCREEN', 'Exit fullscreen'),

       ('ca', 'ADD_FILE', 'Afegir fitxer'),
       ('ca', 'FULLSCREEN', 'Pantalla completa'),
       ('ca', 'EXIT_FULLSCREEN', 'Sortir de pantalla completa'),

       ('es', 'ADD_FILE', 'Agregar archivo'),
       ('es', 'FULLSCREEN', 'Pantalla completa'),
       ('es', 'EXIT_FULLSCREEN', 'Salir de pantalla completa'),

       ('it', 'ADD_FILE', 'Aggiungi file'),
       ('it', 'FULLSCREEN', 'Schermo intero'),
       ('it', 'EXIT_FULLSCREEN', 'Esci da schermo intero')
ON CONFLICT (code, language) DO UPDATE SET text = EXCLUDED.text;

-- Existing labels whose wording now covers the Kindle file type too, and
-- the card title now that it lists several files instead of one.
INSERT INTO app_labels (language, code, text)
VALUES ('en', 'EBOOK_FILE', 'Ebook files'),
       ('en', 'EBOOK_FILE_DRAG_AND_DROP', 'Drag and drop an epub, pdf or Kindle file'),
       ('en', 'ONLY_EBOOK_FILES_ALLOWED', 'Only EPUB, PDF or Kindle files are allowed'),

       ('ca', 'EBOOK_FILE', 'Fitxers digitals'),
       ('ca', 'EBOOK_FILE_DRAG_AND_DROP', 'Arrossega i deixa anar un epub, pdf o fitxer Kindle'),
       ('ca', 'ONLY_EBOOK_FILES_ALLOWED', 'Només es permeten fitxers EPUB, PDF o Kindle'),

       ('es', 'EBOOK_FILE', 'Archivos digitales'),
       ('es', 'EBOOK_FILE_DRAG_AND_DROP', 'Arrastra y suelta un epub, pdf o archivo Kindle'),
       ('es', 'ONLY_EBOOK_FILES_ALLOWED', 'Solo se permiten archivos EPUB, PDF o Kindle'),

       ('it', 'EBOOK_FILE', 'File digitali'),
       ('it', 'EBOOK_FILE_DRAG_AND_DROP', 'Trascina e rilascia un epub, pdf o file Kindle'),
       ('it', 'ONLY_EBOOK_FILES_ALLOWED', 'Sono consentiti solo file EPUB, PDF o Kindle')
ON CONFLICT (code, language) DO UPDATE SET text = EXCLUDED.text;
