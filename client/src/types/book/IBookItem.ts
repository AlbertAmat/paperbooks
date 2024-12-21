export default interface IBookItem {
    id: number;
    name: string;
    author: string | null;
    image_url: string | null;
    isbn: string | null;
    category_id: number | null;
    language_code: string | null;
}