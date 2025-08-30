import {BookStockStatusEnum} from "@/types/book/IBookStock";

export default interface ILocationBook {
    id:number;
    book_id: number;
    code: string;
    name: string;
    status: BookStockStatusEnum
}