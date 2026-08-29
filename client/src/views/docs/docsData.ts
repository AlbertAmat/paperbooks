/**
 * Static content + i18n for the in-app documentation view (`DocsView.vue`):
 * each section's Markdown body is authored once per locale under
 * `content/<locale>/NN-section.md` and imported as a raw string (see
 * `shims-md.d.ts` for the `?raw` import type), then rendered via
 * `MarkdownViewer.vue`. Locale is independent of `i18n.ts` - it's driven by
 * the same current app language but resolved with `normalizeDocLocale`.
 */
import enGettingStarted from "./content/en/01-getting-started.md?raw";
import esGettingStarted from "./content/es/01-getting-started.md?raw";
import caGettingStarted from "./content/ca/01-getting-started.md?raw";
import itGettingStarted from "./content/it/01-getting-started.md?raw";

import enDashboard from "./content/en/02-dashboard.md?raw";
import esDashboard from "./content/es/02-dashboard.md?raw";
import caDashboard from "./content/ca/02-dashboard.md?raw";
import itDashboard from "./content/it/02-dashboard.md?raw";

import enSearchingTheLibrary from "./content/en/03-searching-the-library.md?raw";
import esSearchingTheLibrary from "./content/es/03-searching-the-library.md?raw";
import caSearchingTheLibrary from "./content/ca/03-searching-the-library.md?raw";
import itSearchingTheLibrary from "./content/it/03-searching-the-library.md?raw";

import enAddingBooks from "./content/en/04-adding-books.md?raw";
import esAddingBooks from "./content/es/04-adding-books.md?raw";
import caAddingBooks from "./content/ca/04-adding-books.md?raw";
import itAddingBooks from "./content/it/04-adding-books.md?raw";

import enBookDetails from "./content/en/05-book-details.md?raw";
import esBookDetails from "./content/es/05-book-details.md?raw";
import caBookDetails from "./content/ca/05-book-details.md?raw";
import itBookDetails from "./content/it/05-book-details.md?raw";

import enPrintingLabels from "./content/en/06-printing-labels.md?raw";
import esPrintingLabels from "./content/es/06-printing-labels.md?raw";
import caPrintingLabels from "./content/ca/06-printing-labels.md?raw";
import itPrintingLabels from "./content/it/06-printing-labels.md?raw";

import enLendingAndReturns from "./content/en/07-lending-and-returns.md?raw";
import esLendingAndReturns from "./content/es/07-lending-and-returns.md?raw";
import caLendingAndReturns from "./content/ca/07-lending-and-returns.md?raw";
import itLendingAndReturns from "./content/it/07-lending-and-returns.md?raw";

import enCustomers from "./content/en/08-customers-and-groups.md?raw";
import esCustomers from "./content/es/08-customers-and-groups.md?raw";
import caCustomers from "./content/ca/08-customers-and-groups.md?raw";
import itCustomers from "./content/it/08-customers-and-groups.md?raw";

import enCategoriesAndAuthors from "./content/en/09-categories-and-authors.md?raw";
import esCategoriesAndAuthors from "./content/es/09-categories-and-authors.md?raw";
import caCategoriesAndAuthors from "./content/ca/09-categories-and-authors.md?raw";
import itCategoriesAndAuthors from "./content/it/09-categories-and-authors.md?raw";

import enLocations from "./content/en/10-locations.md?raw";
import esLocations from "./content/es/10-locations.md?raw";
import caLocations from "./content/ca/10-locations.md?raw";
import itLocations from "./content/it/10-locations.md?raw";

import enSettings from "./content/en/11-settings.md?raw";
import esSettings from "./content/es/11-settings.md?raw";
import caSettings from "./content/ca/11-settings.md?raw";
import itSettings from "./content/it/11-settings.md?raw";

export type DocLocale = "en" | "es" | "ca" | "it";

export const DEFAULT_DOC_LOCALE: DocLocale = "en";

const SUPPORTED_DOC_LOCALES: DocLocale[] = ["en", "es", "ca", "it"];

/** Fall back to `DEFAULT_DOC_LOCALE` ("en") for any unsupported/missing locale. */
export function normalizeDocLocale(locale: string | undefined | null): DocLocale {
    return (SUPPORTED_DOC_LOCALES as string[]).includes(locale || "")
        ? (locale as DocLocale)
        : DEFAULT_DOC_LOCALE;
}

export const docsUiLabels: Record<DocLocale, { pageTitle: string; sidebarHeading: string }> = {
    en: {pageTitle: "Documentation", sidebarHeading: "Documentation"},
    es: {pageTitle: "Documentación", sidebarHeading: "Documentación"},
    ca: {pageTitle: "Documentació", sidebarHeading: "Documentació"},
    it: {pageTitle: "Documentazione", sidebarHeading: "Documentazione"},
};

interface DocSectionTranslation {
    title: string;
    content: string;
}

interface DocSectionDefinition {
    id: string;
    icon: string;
    translations: Record<DocLocale, DocSectionTranslation>;
}

const docSectionDefinitions: DocSectionDefinition[] = [
    {
        id: "getting-started",
        icon: "mdi-rocket-launch-outline",
        translations: {
            en: {title: "Getting started", content: enGettingStarted},
            es: {title: "Primeros pasos", content: esGettingStarted},
            ca: {title: "Primers passos", content: caGettingStarted},
            it: {title: "Per iniziare", content: itGettingStarted},
        },
    },
    {
        id: "dashboard",
        icon: "mdi-chart-box-outline",
        translations: {
            en: {title: "Dashboard", content: enDashboard},
            es: {title: "Panel de control", content: esDashboard},
            ca: {title: "Tauler de control", content: caDashboard},
            it: {title: "Dashboard", content: itDashboard},
        },
    },
    {
        id: "searching-the-library",
        icon: "mdi-bookshelf",
        translations: {
            en: {title: "Searching the library", content: enSearchingTheLibrary},
            es: {title: "Buscar en la biblioteca", content: esSearchingTheLibrary},
            ca: {title: "Cercar a la biblioteca", content: caSearchingTheLibrary},
            it: {title: "Cercare in biblioteca", content: itSearchingTheLibrary},
        },
    },
    {
        id: "adding-books",
        icon: "mdi-book-plus-outline",
        translations: {
            en: {title: "Adding books", content: enAddingBooks},
            es: {title: "Añadir libros", content: esAddingBooks},
            ca: {title: "Afegir llibres", content: caAddingBooks},
            it: {title: "Aggiungere libri", content: itAddingBooks},
        },
    },
    {
        id: "book-details",
        icon: "mdi-book-open-variant-outline",
        translations: {
            en: {title: "Book details & stock", content: enBookDetails},
            es: {title: "Detalles del libro y existencias", content: esBookDetails},
            ca: {title: "Detalls del llibre i estoc", content: caBookDetails},
            it: {title: "Dettagli del libro e scorte", content: itBookDetails},
        },
    },
    {
        id: "printing-labels",
        icon: "mdi-printer-outline",
        translations: {
            en: {title: "Printing labels", content: enPrintingLabels},
            es: {title: "Imprimir etiquetas", content: esPrintingLabels},
            ca: {title: "Imprimir etiquetes", content: caPrintingLabels},
            it: {title: "Stampare le etichette", content: itPrintingLabels},
        },
    },
    {
        id: "lending-and-returns",
        icon: "mdi-swap-horizontal",
        translations: {
            en: {title: "Lending & returns", content: enLendingAndReturns},
            es: {title: "Préstamos y devoluciones", content: esLendingAndReturns},
            ca: {title: "Préstecs i devolucions", content: caLendingAndReturns},
            it: {title: "Prestiti e restituzioni", content: itLendingAndReturns},
        },
    },
    {
        id: "customers-and-groups",
        icon: "mdi-account-school-outline",
        translations: {
            en: {title: "Customers & groups", content: enCustomers},
            es: {title: "Clientes y grupos", content: esCustomers},
            ca: {title: "Clients i grups", content: caCustomers},
            it: {title: "Clienti e gruppi", content: itCustomers},
        },
    },
    {
        id: "categories-and-authors",
        icon: "mdi-shape-outline",
        translations: {
            en: {title: "Categories & authors", content: enCategoriesAndAuthors},
            es: {title: "Categorías y autores", content: esCategoriesAndAuthors},
            ca: {title: "Categories i autors", content: caCategoriesAndAuthors},
            it: {title: "Categorie e autori", content: itCategoriesAndAuthors},
        },
    },
    {
        id: "locations",
        icon: "mdi-map-marker-radius",
        translations: {
            en: {title: "Locations", content: enLocations},
            es: {title: "Ubicaciones", content: esLocations},
            ca: {title: "Ubicacions", content: caLocations},
            it: {title: "Ubicazioni", content: itLocations},
        },
    },
    {
        id: "settings",
        icon: "mdi-cog-outline",
        translations: {
            en: {title: "Account settings", content: enSettings},
            es: {title: "Configuración de la cuenta", content: esSettings},
            ca: {title: "Configuració del compte", content: caSettings},
            it: {title: "Impostazioni account", content: itSettings},
        },
    },
];

export interface DocSection {
    id: string;
    title: string;
    icon: string;
    content: string;
}

/** All documentation sections, titled and rendered in the given locale (normalized). */
export function getDocSections(locale: string | undefined | null): DocSection[] {
    const docLocale = normalizeDocLocale(locale);

    return docSectionDefinitions.map(definition => ({
        id: definition.id,
        icon: definition.icon,
        title: definition.translations[docLocale].title,
        content: definition.translations[docLocale].content,
    }));
}

/** Look up one documentation section by id (e.g. "dashboard"); falls back to the first section if not found. */
export function getDocSection(id: string | undefined, locale: string | undefined | null): DocSection {
    const sections = getDocSections(locale);
    return sections.find(section => section.id === id) || sections[0];
}
