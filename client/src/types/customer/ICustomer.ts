export default interface ICustomer {
    id: number;
    name: string;
    group_id: number | null;
    group_name: string | null;
}

export interface ICustomerDetail extends ICustomer{
    tags: number[];
    total_books: number;
}