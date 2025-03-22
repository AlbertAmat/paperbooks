import IBookItem from "@/types/book/IBookItem";
import {IBookStock} from "@/types/book/IBookStock";

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
