/**
 * A customer, as returned in list contexts (`GET /customer`).
 *
 * @example
 * const c: ICustomer = { id: 7, name: "Jane Doe", group_id: 1, group_name: "Class 4B" };
 */
export default interface ICustomer {
    id: number;
    name: string;
    group_id: number | null;
    group_name: string | null;
}

/**
 * `ICustomer` extended with the extra fields shown on the customers table -
 * assigned tag ids and the count of books currently on loan.
 */
export interface ICustomerDetail extends ICustomer{
    tags: number[];
    total_books: number;
}
