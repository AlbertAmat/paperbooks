/**
 * Bookkeeping for `loan_history` - a persistent log of every loan and its
 * return, kept separate from `book_stocks` (which only tracks the *current*
 * loan and wipes `customer_id`/`loaned_at` on return). Every code path that
 * lends or returns a book_stocks copy (see BooksRoute.ts and
 * CustomerRoute.ts) must call `recordLoan`/`recordReturn` alongside its
 * `book_stocks` update, so the Loans view's Excel report stays accurate.
 */
import {Pool, PoolClient} from "pg";

/**
 * Log a new loan: snapshots the book/customer/group names as they are right
 * now, so the report stays readable even if one of them is later renamed or
 * deleted.
 * @param db Pool or client to run the query on.
 * @param userId Owning user id.
 * @param stockCode The loaned copy's book_stocks.code.
 * @param customerId The customer the copy was loaned to.
 */
export async function recordLoan(db: Pool | PoolClient, userId: number, stockCode: string, customerId: number): Promise<void> {
    await db.query(
        `INSERT INTO loan_history (user_id, book_id, book_name, stock_id, stock_code, customer_id, customer_name, group_id, group_name, loaned_at)
         SELECT bs.user_id, bs.book_id, b.name, bs.id, bs.code, c.id, c.name, cg.id, cg.name, NOW()
         FROM book_stocks bs
                  JOIN books b ON b.id = bs.book_id
                  JOIN customers c ON c.id = $2 AND c.user_id = bs.user_id
                  LEFT JOIN customer_groups cg ON cg.id = c.group_id
         WHERE bs.code = $1
           AND bs.user_id = $3`,
        [stockCode, customerId, userId]
    );
}

/**
 * Close out the most recent open loan_history entry for a returned copy.
 * A no-op if there's no matching entry (e.g. the loan happened before this
 * table existed).
 * @param db Pool or client to run the query on.
 * @param userId Owning user id.
 * @param stockCode The returned copy's book_stocks.code.
 */
export async function recordReturn(db: Pool | PoolClient, userId: number, stockCode: string): Promise<void> {
    await db.query(
        `UPDATE loan_history
         SET returned_at = NOW()
         WHERE id = (
             SELECT id
             FROM loan_history
             WHERE user_id = $1
               AND stock_code = $2
               AND returned_at IS NULL
             ORDER BY loaned_at DESC
             LIMIT 1
         )`,
        [userId, stockCode]
    );
}
