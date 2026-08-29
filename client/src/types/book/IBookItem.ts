import IBookAuthor from "@/types/book/IBookAuthor";
import {IBookBase} from "@/types/book/IBookBase";

/**
 * Book shape returned by the search list endpoint (`GET /book/search`) -
 * enough to render a result card, without the heavier detail fields
 * (description, stocks, ...) that live on `IBook`.
 *
 * @example
 * const item: IBookItem = {
 *   id: 12, name: "The Hobbit", image_url: null, isbn: "9780261102217",
 *   category_id: 3, language_code: "en", authors: [{ id: 4, name: "J.R.R. Tolkien" }]
 * };
 */
export default interface IBookItem extends IBookBase{
    category_id: number | null;
    language_code: string | null;
    authors: IBookAuthor[];
}
