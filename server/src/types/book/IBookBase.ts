/**
 * Minimal book identity fields shared by every book-related DTO
 * (search results, add-metadata lookups, etc).
 *
 * @example
 * const b: IBookBase = { id: 12, name: "The Hobbit", image_url: null, isbn: "9780261102217" };
 */
export interface IBookBase {
    id: number;
    name: string;
    image_url: string | null;
    isbn: string | null;
}