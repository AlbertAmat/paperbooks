-- Upgrade to v1.1.2 - schema changes made on 2026-09-05.
-- Brings an already-installed database in line with the v1.1.2 databaseSchema.sql.
-- (New installs should use databaseSchema.sql directly and skip this file.)

-- Labels for the library search page's new "filter by category" control
-- (SearchToolbarFilterMenu.vue/SearchFilters.vue) and "group by category"
-- toggle (BooksSearchView.vue).
INSERT INTO app_labels (language, code, text)
VALUES ('en', 'CATEGORY_FILTER', 'Category'),
       ('en', 'ALL_CATEGORIES', 'All categories'),
       ('en', 'GROUP_BY_CATEGORY', 'Group by category'),
       ('en', 'UNCATEGORIZED', 'Uncategorized'),

       ('ca', 'CATEGORY_FILTER', 'Categoria'),
       ('ca', 'ALL_CATEGORIES', 'Totes les categories'),
       ('ca', 'GROUP_BY_CATEGORY', 'Agrupar per categoria'),
       ('ca', 'UNCATEGORIZED', 'Sense categoria'),

       ('es', 'CATEGORY_FILTER', 'Categoría'),
       ('es', 'ALL_CATEGORIES', 'Todas las categorías'),
       ('es', 'GROUP_BY_CATEGORY', 'Agrupar por categoría'),
       ('es', 'UNCATEGORIZED', 'Sin categoría'),

       ('it', 'CATEGORY_FILTER', 'Categoria'),
       ('it', 'ALL_CATEGORIES', 'Tutte le categorie'),
       ('it', 'GROUP_BY_CATEGORY', 'Raggruppa per categoria'),
       ('it', 'UNCATEGORIZED', 'Non categorizzato');
