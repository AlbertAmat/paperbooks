/**
 * Extra filters sent as the `filters` query param (comma-separated) to
 * `GET /book/search`, narrowing results by stock availability.
 *
 * @example
 * // book/search?filters=HAS_STOCK
 * SearchService.search({ filters: [SearchFilter.HAS_STOCK] });
 */
export enum SearchFilter {
    /** Books with zero stock entries. */
    NO_STOCK="NO_STOCK",
    /** Books with at least one stock entry. */
    HAS_STOCK="HAS_STOCK"
}
