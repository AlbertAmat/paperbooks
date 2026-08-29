export type LegalBlock =
    | { type: "heading"; text: string }
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] }
    | { type: "table"; headers: string[]; rows: string[][] };
