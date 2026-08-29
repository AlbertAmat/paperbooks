import IBookItem from "@/types/book/IBookItem";

/**
 * Response shape for `GET /book/search` - a page of matching books plus
 * pagination info (`total` results overall, `limit` per page).
 */
export interface ISearchResponse {
    total: number;
    limit: number;
    books: IBookItem[];
}
