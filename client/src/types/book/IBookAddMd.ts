import {IBookBase} from "@/types/book/IBookBase";
import {IBookStockBase} from "@/types/book/IBookStockBase";

export interface IBookAddMd extends IBookBase {
    stocks: IBookStockBase[];
}
