import {IBookStockBase} from "./IBookStockBase";
import {IBookBase} from "./IBookBase";

export interface IBookAddMd extends IBookBase {
    stocks: IBookStockBase[];
}
