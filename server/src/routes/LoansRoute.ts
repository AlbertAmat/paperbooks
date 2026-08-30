/**
 * =============================================================================
 * LoansRoute
 * =============================================================================
 * Mounted at `/api/rest/loans`. Read-only, paginated/filterable listing of
 * books currently on loan (a `book_stocks` row with `status = 2`), for the
 * Loans management view. Returning a book is handled by the existing
 * `POST /book/return` (see BooksRoute.ts) - this route only lists.
 */
import { Router, Request, Response } from 'express';
import {appService} from "../AppService";
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = Router();

/**
 * GET /loans
 * -----------
 * Paginated list of books currently on loan, each with its borrower and the
 * borrower's group, newest loan first.
 *
 * Auth: required.
 *
 * Query params (all optional):
 *  - group_id   {number} Restrict to customers in this group.
 *  - date_from  {string} "YYYY-MM-DD" - only loans made on/after this date.
 *  - date_to    {string} "YYYY-MM-DD" - only loans made on/before this date.
 *  - page       {number} Zero-based page index. 50 results per page.
 *
 * Example request: GET /api/rest/loans?group_id=2&date_from=2026-08-01&page=0
 *
 * Example response (200):
 *  {
 *    "total": 3,
 *    "limit": 50,
 *    "loans": [
 *      { "stockId": 5, "stockCode": "a1b2c3d4e5",
 *        "bookId": 12, "bookName": "The Hobbit", "imageUrl": "...",
 *        "customerId": 4, "customerName": "Maria Puig",
 *        "groupId": 2, "groupName": "Class 4B",
 *        "loanedAt": "2026-08-30T05:39:03.026Z" }
 *    ]
 *  }
 */
//@ts-ignore
router.get('', requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    const groupId = req.query.group_id ? Number(req.query.group_id) : null;
    const dateFrom = req.query.date_from ? String(req.query.date_from) : null;
    const dateTo = req.query.date_to ? String(req.query.date_to) : null;
    const page = Math.max(0, Number(req.query.page)) || 0;

    try {
        const MAX_ROWS = 50;
        const skip = MAX_ROWS * page;

        const params: any[] = [userId];
        const conditions: string[] = [
            `bs.user_id = $1`,
            `bs.status = 2`
        ];

        if (groupId) {
            conditions.push(`cg.id = $${params.push(groupId)}`);
        }
        if (dateFrom) {
            conditions.push(`bs.loaned_at >= $${params.push(dateFrom)}::date`);
        }
        if (dateTo) {
            conditions.push(`bs.loaned_at < $${params.push(dateTo)}::date + INTERVAL '1 day'`);
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`;

        const fromClause = `
            FROM book_stocks bs
                     JOIN books b ON b.id = bs.book_id AND b.user_id = bs.user_id
                     JOIN customers c ON c.id = bs.customer_id AND c.user_id = bs.user_id
                     LEFT JOIN customer_groups cg ON cg.id = c.group_id AND cg.user_id = bs.user_id
        `;

        const totalResult = await pool.query(`SELECT COUNT(*) ${fromClause} ${whereClause}`, params);

        const result = await pool.query(
            `SELECT bs.id           AS "stockId",
                    bs.code         AS "stockCode",
                    bs.loaned_at    AS "loanedAt",
                    b.id            AS "bookId",
                    b.name          AS "bookName",
                    b.image_url     AS "imageUrl",
                    c.id            AS "customerId",
                    c.name          AS "customerName",
                    cg.id           AS "groupId",
                    cg.name         AS "groupName"
             ${fromClause}
             ${whereClause}
             ORDER BY bs.loaned_at DESC NULLS LAST, bs.id DESC
                 LIMIT ${MAX_ROWS}
             OFFSET ${skip}`,
            params
        );

        res.status(200).json({
            total: Number(totalResult.rows[0].count),
            limit: MAX_ROWS,
            loans: result.rows
        });
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
