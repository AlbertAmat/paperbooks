/**
 * A customer group (e.g. a class or department), as returned by `GET /customer/group`.
 *
 * @example
 * const g: ICustomerGroup = { id: 1, name: "Class 4B", description: "", total_customers: 22 };
 */
export interface ICustomerGroup {
    id: number;
    name: string;
    description?: string;
    total_customers?: number;
}
