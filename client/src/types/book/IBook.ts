import IBookItem from "@/types/book/IBookItem";
import {IBookStock} from "@/types/book/IBookStock";

/**
 * Full book detail as returned by `GET /book/:id` - everything `IBookItem`
 * has plus description/publisher metadata and the full list of physical
 * stocks. Used on the book detail view.
 */
export default interface IBook extends IBookItem {
    description: string | null;
    publisher: string | null;
    published_date: string | null;
    pages: number | null;
    stocks: IBookStock[];
    format_id: number | null;
    date_created: string;
    date_updated: string;
}
