/**
 * Metadata for one of a book's optional backed-up ebook files (see
 * `book_files` table - up to one row per `file_type`). Never carries the
 * file bytes themselves - those are only streamed via the dedicated
 * download route.
 *
 * @example
 * const f: IBookFile = { id: 3, file_type: "epub", file_name: "hobbit.epub", file_size: 512000, date_created: "2026-08-30T00:00:00.000Z" };
 */
export interface IBookFile {
    id: number;
    file_type: "epub" | "pdf" | "mobi";
    file_name: string;
    file_size: number;
    date_created: string;
}
