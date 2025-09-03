import {IBookStockBase} from "@/types/book/IBookStockBase";

export interface IBookStock extends IBookStockBase{
    id: number;
    code: string;
    status:BookStockStatusEnum;
    location_id: number;
    location_name: string;
    customer_id: number;
    customer_name: string;
}


export enum BookStockStatusEnum {
    AVAILABLE = 0,
    NOT_AVAILABLE = 1,
    BOOKED = 2,
    DAMAGE = 3
}