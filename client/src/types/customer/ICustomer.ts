export default interface ICustomer {
    id: number;
    name: string;
}

export interface ICustomerDetail extends ICustomer{
    tags: number[];
    total_books: number;
}