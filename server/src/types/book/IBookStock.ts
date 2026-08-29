/**
 * Lifecycle states for a single physical copy of a book (`book_stocks.status`).
 *
 * @example
 * if (stock.status === BookStockStatusEnum.AVAILABLE) { ... }
 */
export enum BookStockStatusEnum {
    /** On a shelf, not lent out or damaged. */
    AVAILABLE = 0,
    /** Withdrawn from circulation (e.g. lost, retired). */
    NOT_AVAILABLE = 1,
    /** Currently lent/checked out to a customer. */
    BOOKED = 2,
    /** Marked as damaged. */
    DAMAGE = 3
}
