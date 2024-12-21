import IBookItem from "@/types/book/IBookItem";

export interface ISearchResponse {
    total: number;
    limit: number;
    books: IBookItem[];
}