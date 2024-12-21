import IBookItem from "@/types/book/IBookItem";

export default interface IBook extends IBookItem {
    description: string | null;
    publisher: string | null;
    published_date: string | null;
    pages: number | null;
    format: string | null;
    created_date: string | null;
}