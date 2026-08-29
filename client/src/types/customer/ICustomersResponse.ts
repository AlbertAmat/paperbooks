import {ICustomerDetail} from "@/types/customer/ICustomer";
import {ITag} from "@/types/customer/ITag";

/**
 * Response shape for `GET /customer` - the customer list plus every tag
 * available to the user, fetched together in one call.
 */
export interface ICustomersResponse {
    customers: ICustomerDetail[];
    tags: ITag[];
}
