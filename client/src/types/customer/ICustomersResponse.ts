import {ICustomerDetail} from "@/types/customer/ICustomer";
import {ITag} from "@/types/customer/ITag";

export interface ICustomersResponse {
    customers: ICustomerDetail[];
    tags: ITag[];
}