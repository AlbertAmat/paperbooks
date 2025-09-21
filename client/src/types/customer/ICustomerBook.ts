import {IBookBase} from "@/types/book/IBookBase";

export interface ICustomerBook extends IBookBase{
    /**
     * Book stock code
     */
    code: string;
}