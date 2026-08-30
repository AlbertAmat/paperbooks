/**
 * =============================================================================
 * DashboardRoute
 * =============================================================================
 * Mounted at `/api/rest/dashboard`. A single read-only aggregate endpoint
 * powering the dashboard view's KPIs and charts.
 */
import { Router, Request, Response } from 'express';
import {appService} from "../AppService";
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = Router();

/**
 * GET /dashboard
 * ---------------
 * Returns all the counters/series the dashboard needs in one round trip,
 * running every query concurrently via `Promise.all`.
 *
 * Auth: required.
 *
 * Example response (200):
 *  {
 *    "lastBooks": [{ "id": 12, "name": "The Hobbit", "image_url": "...",
 *                     "isbn": "9780261102217", "pages": 310, "date_created": "2026-08-01T..." }],
 *    "totalBooks": "42",
 *    "totalThisMonth": "3",
 *    "totalLastMonth": "5",
 *    "totalCategories": "6",
 *    "totalCustomers": "10",
 *    "booksInTime": [{ "month": "2026-08-01T00:00:00.000Z", "total_books": "3" }],
 *    "stockStatus": [{ "status": 0, "count": "20" }, { "status": 2, "count": "5" }],
 *    "totalBookedBooks": "5",
 *    "totalLocations": "2",
 *    "totalAuthors": "15",
 *    "categoryShelves": [{ "id": 3, "name": "Fantasy", "count": "10",
 *                          "books": [{ "id": 12, "name": "The Hobbit", "image_url": "..." }] }],
 *    "currentlyOnLoan": [{ "bookId": 12, "bookName": "The Hobbit", "imageUrl": "...",
 *                          "customerId": 4, "customerName": "Maria Puig" }]
 *  }
 *
 * Note: count fields come back as strings because Postgres `COUNT(*)` yields
 * a `bigint`, which node-postgres serializes as a string to avoid precision loss.
 */
//@ts-ignore
router.get('', requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        const [
            lastBooks,
            totalBooks,
            totalThisMonth,
            totalLastMonth,
            totalCategories,
            totalCustomers,
            booksInTime,
            stockStatus,
            totalBookedBooks,
            totalLocations,
            totalAuthors,
            categoryShelfRows,
            currentlyOnLoan
        ] = await Promise.all([
            pool.query(`
                    SELECT b.id,
                           b.name,
                           b.image_url,
                           b.isbn,
                            b.pages,
                            b.date_created
                    FROM books b
                    WHERE b.user_id = $1
                      AND b.date_created >= NOW() - INTERVAL '30 days'
                    ORDER BY b.date_created DESC
                        LIMIT 10;
            `,  [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM books WHERE user_id = $1`, [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM books WHERE user_id = $1 AND date_created >= date_trunc('month', CURRENT_DATE)`, [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM books WHERE user_id = $1 AND date_created >= date_trunc('month', CURRENT_DATE - interval '1 month') AND date_created < date_trunc('month', CURRENT_DATE)`, [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM categories WHERE user_id = $1`, [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM customers WHERE user_id = $1`, [userId]),
            pool.query(`SELECT date_trunc('month', date_created) AS month, COUNT(*) AS total_books FROM books WHERE user_id = $1 GROUP BY month ORDER BY month`, [userId]),
            pool.query(`SELECT status, COUNT(*) AS count FROM book_stocks WHERE user_id = $1 GROUP BY status`, [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM book_stocks WHERE user_id = $1 AND customer_id IS NOT NULL`, [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM locations WHERE user_id = $1`, [userId]),
            pool.query(`SELECT COUNT(*) AS count FROM authors WHERE user_id = $1`, [userId]),
            // Top 6 categories by book count, each with a sample of its 10
            // most recently added books - powers the dashboard's category
            // pills and the "browse by category" shelves underneath them.
            pool.query(`
                    WITH top_categories AS (
                        SELECT c.id, c.name, COUNT(b.id) AS count
                        FROM categories c
                                 LEFT JOIN books b ON b.category_id = c.id AND b.user_id = c.user_id
                        WHERE c.user_id = $1
                        GROUP BY c.id, c.name
                        ORDER BY count DESC, c.name ASC
                            LIMIT 6
                    ),
                         ranked_books AS (
                             SELECT b.id, b.name, b.image_url, b.category_id,
                                    ROW_NUMBER() OVER (PARTITION BY b.category_id ORDER BY b.date_created DESC) AS rn
                             FROM books b
                             WHERE b.user_id = $1
                               AND b.category_id IN (SELECT id FROM top_categories)
                         )
                    SELECT tc.id AS category_id, tc.name AS category_name, tc.count,
                           rb.id AS book_id, rb.name AS book_name, rb.image_url
                    FROM top_categories tc
                             LEFT JOIN ranked_books rb ON rb.category_id = tc.id AND rb.rn <= 10
                    ORDER BY tc.count DESC, tc.name, rb.rn
            `, [userId]),
            // The 5 most recent loans, with who they're loaned to - turns the
            // "booked books" count into an actual list on the dashboard.
            pool.query(`
                    SELECT b.id AS "bookId", b.name AS "bookName", b.image_url AS "imageUrl",
                           c.id AS "customerId", c.name AS "customerName"
                    FROM book_stocks bs
                             JOIN books b ON b.id = bs.book_id AND b.user_id = bs.user_id
                             JOIN customers c ON c.id = bs.customer_id AND c.user_id = bs.user_id
                    WHERE bs.user_id = $1
                      AND bs.status = 2
                    ORDER BY bs.id DESC
                        LIMIT 5
            `, [userId])
        ]);

        // Fold the denormalized category/book rows into one entry per
        // category, each carrying its sample of books.
        const categoryShelvesById = new Map<number, { id: number; name: string; count: string; books: { id: number; name: string; image_url: string | null }[] }>();
        for (const row of categoryShelfRows.rows) {
            if (!categoryShelvesById.has(row.category_id)) {
                categoryShelvesById.set(row.category_id, {
                    id: row.category_id,
                    name: row.category_name,
                    count: row.count,
                    books: []
                });
            }
            if (row.book_id !== null) {
                categoryShelvesById.get(row.category_id)!.books.push({
                    id: row.book_id,
                    name: row.book_name,
                    image_url: row.image_url
                });
            }
        }

        res.json({
            lastBooks: lastBooks.rows,
            totalBooks: totalBooks.rows[0].count,
            totalThisMonth: totalThisMonth.rows[0].count,
            totalLastMonth: totalLastMonth.rows[0].count,
            totalCategories: totalCategories.rows[0].count,
            totalCustomers: totalCustomers.rows[0].count,
            booksInTime: booksInTime.rows,
            stockStatus: stockStatus.rows,
            totalBookedBooks: totalBookedBooks.rows[0].count,
            totalLocations: totalLocations.rows[0].count,
            totalAuthors: totalAuthors.rows[0].count,
            categoryShelves: Array.from(categoryShelvesById.values()),
            currentlyOnLoan: currentlyOnLoan.rows,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

export default router;