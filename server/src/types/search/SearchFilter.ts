/**
 * Extra filters accepted by `GET /book/search`'s `filters` query param
 * (comma-separated), narrowing results by stock availability.
 *
 * @example
 * // GET /api/rest/book/search?filters=HAS_STOCK,NO_STOCK
 * const filters = "HAS_STOCK,NO_STOCK".split(",") as SearchFilter[];
 */
export enum SearchFilter {
    /** Books with zero stock entries. */
    NO_STOCK = "NO_STOCK",
    /** Books with at least one stock entry. */
    HAS_STOCK = "HAS_STOCK"
}
