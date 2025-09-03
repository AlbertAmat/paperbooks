import {BookStockStatusEnum} from "@/types/book/IBookStock";

export interface IBookStockBase {
    id: number;
    code: string;
    status:BookStockStatusEnum;
}