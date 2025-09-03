import {BookStockStatusEnum} from "./IBookStock";

export interface IBookStockBase {
    id: number;
    code: string;
    status:BookStockStatusEnum;
}