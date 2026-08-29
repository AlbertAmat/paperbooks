/**
 * Application-specific error codes. Currently unused as HTTP status codes
 * in the routes (which return plain 404/500 today) - kept as a place to
 * attach a stable, app-specific code to a client-side error payload.
 *
 * @example
 * if (AppErrors.BOOK_NOT_FOUND === someCode) { ... }
 */
export enum AppErrors {
    BOOK_NOT_FOUND = 444
}