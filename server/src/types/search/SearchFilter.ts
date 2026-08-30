/**
 * Extra filters accepted by `GET /book/search`'s `filters` query param
 * (comma-separated), narrowing results by stock availability, loan status
 * or recency.
 *
 * @example
 * // GET /api/rest/book/search?filters=HAS_STOCK,NO_STOCK
 * const filters = "HAS_STOCK,NO_STOCK".split(",") as SearchFilter[];
 */
export enum SearchFilter {
    /** Books with zero stock entries. */
    NO_STOCK = "NO_STOCK",
    /** Books with at least one stock entry. */
    HAS_STOCK = "HAS_STOCK",
    /** Books with at least one stock currently on loan (status 2). */
    ON_LOAN = "ON_LOAN",
    /** Books added in the last 30 days. */
    RECENT = "RECENT"
}
