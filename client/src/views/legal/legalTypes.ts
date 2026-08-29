/**
 * A structured content block for rendering a legal document (privacy
 * policy, terms of service, cookie policy) without raw HTML, keyed on
 * `type` so `LegalContent.vue` can render each variant appropriately.
 */
export type LegalBlock =
    | { type: "heading"; text: string }
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] }
    | { type: "table"; headers: string[]; rows: string[][] };
