/**
 * Sort order accepted by `GET /book/search`'s `sort` query param.
 * Defaults to `NAME_ASC` when omitted/unrecognized.
 *
 * @example
 * // GET /api/rest/book/search?sort=DATE_NEWEST
 */
export enum SortType {
    /** Book name, A-Z (default). */
    NAME_ASC = "NAME_ASC",
    /** Book name, Z-A. */
    NAME_DESC = "NAME_DESC",
    /** Most recently added first. */
    DATE_NEWEST = "DATE_NEWEST",
    /** Least recently added first. */
    DATE_OLDEST = "DATE_OLDEST"
}
