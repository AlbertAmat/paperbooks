import IBookAuthor from "@/types/book/IBookAuthor";

export default interface IBookItem {
    id: number;
    name: string;
    author_name: string | null;
    image_url: string | null;
    isbn: string | null;
    category_id: number | null;
    language_code: string | null;
    authors: IBookAuthor[];
}