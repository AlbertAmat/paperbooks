import {IBookStockBase} from "@/types/book/IBookStockBase";

/**
 * A single physical copy of a book, with its resolved location and (if
 * loaned out) customer, as returned by the book detail / stock endpoints.
 *
 * @example
 * const stock: IBookStock = {
 *   id: 5, code: "a1b2c3d4e5", status: BookStockStatusEnum.AVAILABLE,
 *   location_id: 2, location_name: "Main shelf", customer_id: 0, customer_name: ""
 * };
 */
export interface IBookStock extends IBookStockBase{
    id: number;
    code: string;
    status:BookStockStatusEnum;
    location_id: number;
    location_name: string;
    customer_id: number;
    customer_name: string;
}

/** Lifecycle states for a physical book copy (mirrors the server's `BookStockStatusEnum`). */
export enum BookStockStatusEnum {
    /** On a shelf, not lent out or damaged. */
    AVAILABLE = 0,
    /** Withdrawn from circulation. */
    NOT_AVAILABLE = 1,
    /** Currently lent/checked out to a customer. */
    BOOKED = 2,
    /** Marked as damaged. */
    DAMAGE = 3
}
