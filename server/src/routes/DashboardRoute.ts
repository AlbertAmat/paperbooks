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
 *    "totalAuthors": "15"
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
            totalAuthors
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
            pool.query(`SELECT COUNT(*) AS count FROM authors WHERE user_id = $1`, [userId])
        ]);

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
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

export default router;