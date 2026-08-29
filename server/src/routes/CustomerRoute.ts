/**
 * =============================================================================
 * CustomerRoute
 * =============================================================================
 * Mounted at `/api/rest/customer`. Covers two related areas:
 *  - `customer_groups`: organizing customers into named groups (e.g. classes,
 *    departments) - CRUD plus assigning/unassigning a customer to a group.
 *  - `customers`: CRUD, and lending/returning books to a customer (a "loan"
 *    is a `book_stocks` row with `status = 2` and `customer_id` set to them).
 *
 * All routes require auth and are scoped to the caller's `user_id`.
 */
import { Router, Request, Response } from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";
import {Pool} from "pg";

const router = Router();

/*********************************************************
 *
 * Customer groups endpoints
 *
 *********************************************************/


/**
 * GET /customer/group
 * ---------------------
 * List every customer group with its member count.
 *
 * Auth: required.
 *
 * Example response (200):
 *  [{ "id": 1, "name": "Class 4B", "description": "", "total_customers": 22 }]
 */
//@ts-ignore
router.get('/group', requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        const result = await pool.query(`
            SELECT cg.id,
                   cg.name,
                   cg.description,
                   COUNT(c.id)::int AS total_customers
              FROM customer_groups cg
              LEFT JOIN customers c
                ON c.group_id = cg.id
               AND c.user_id = cg.user_id
             WHERE cg.user_id = $1
             GROUP BY cg.id, cg.name, cg.description
             ORDER BY cg.name
        `, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting customer groups:', error);
        res.status(500).send('Internal Server Error');
    }
});


/**
 * POST /customer/group
 * ----------------------
 * Create a new customer group.
 *
 * Auth: required. Body: { "name": "Class 4B", "description": "optional" }
 *
 * Example response (201): { "id": 1, "name": "Class 4B", "description": null }
 * Responses: 400 "Group name is required" | 409 if the name is already taken.
 */
//@ts-ignore
router.post('/group', requireAuth, async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const userId = appService.getSessionUser(req);

    if (!name || !name.trim()) {
        return res.status(400).send('Group name is required');
    }

    const pool = appService.getDatabasePool();

    try {
        const result = await pool.query(`
            INSERT INTO customer_groups (name, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING id, name, description
        `, [
            name.trim(),
            description || null,
            userId
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error creating customer group:', error);

        if (error.code === '23505') {
            return res.status(409).send('A group with this name already exists');
        }

        res.status(500).send('Error creating customer group');
    }
});


/**
 * PUT /customer/group/:id
 * -------------------------
 * Rename/update a customer group.
 *
 * Auth: required. Path param `id` {number}. Body: { "name": "...", "description": "..." }
 *
 * Responses: 200 the updated group | 400 "Group name is required" |
 *            404 "Group not found" | 409 name already taken.
 */
//@ts-ignore
router.put('/group/:id', requireAuth, async (req: Request, res: Response) => {
    const groupId = Number(req.params.id);
    const { name, description } = req.body;
    const userId = appService.getSessionUser(req);

    if (!groupId) {
        return res.status(400).send('No group ID provided');
    }

    if (!name || !name.trim()) {
        return res.status(400).send('Group name is required');
    }

    const pool = appService.getDatabasePool();

    try {
        const result = await pool.query(`
            UPDATE customer_groups
               SET name = $1,
                   description = $2
             WHERE id = $3
               AND user_id = $4
         RETURNING id, name, description
        `, [
            name.trim(),
            description || null,
            groupId,
            userId
        ]);

        if (result.rowCount === 0) {
            return res.status(404).send('Group not found');
        }

        res.status(200).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error updating customer group:', error);

        if (error.code === '23505') {
            return res.status(409).send('A group with this name already exists');
        }

        res.status(500).send('Error updating customer group');
    }
});


/**
 * DELETE /customer/group/:id
 * ----------------------------
 * Delete a customer group. Customers belonging to the group will have
 * `group_id` set to NULL (they are not deleted).
 *
 * Auth: required. Path param `id` {number}.
 *
 * Responses: 200 {"message": "Customer group deleted successfully"} | 404 "Group not found".
 */
//@ts-ignore
router.delete('/group/:id', requireAuth, async (req: Request, res: Response) => {
    const groupId = Number(req.params.id);
    const userId = appService.getSessionUser(req);

    if (!groupId) {
        return res.status(400).send('No group ID provided');
    }

    const pool = appService.getDatabasePool();

    try {
        const result = await pool.query(`
            DELETE FROM customer_groups
             WHERE id = $1
               AND user_id = $2
        `, [groupId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Group not found');
        }

        res.status(200).json({
            message: 'Customer group deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting customer group:', error);
        res.status(500).send('Error deleting customer group');
    }
});


/**
 * PUT /customer/:id/group/:groupId
 * -----------------------------------
 * Assign a customer to a group.
 *
 * Auth: required. Path params: `id` {number} customer id, `groupId` {number} group id.
 *
 * Example response (200): { "id": 7, "name": "Jane Doe", "group_id": 1 }
 * Responses: 404 "Group not found" | 404 "Customer not found".
 */
//@ts-ignore
router.put('/:id/group/:groupId', requireAuth, async (req: Request, res: Response) => {
    const customerId = Number(req.params.id);
    const groupId = Number(req.params.groupId);
    const userId = appService.getSessionUser(req);

    if (!customerId) {
        return res.status(400).send('No customer ID provided');
    }

    if (!groupId) {
        return res.status(400).send('No group ID provided');
    }

    const pool = appService.getDatabasePool();

    try {
        // Make sure the group belongs to the current user
        const group = await pool.query(`
            SELECT id
              FROM customer_groups
             WHERE id = $1
               AND user_id = $2
        `, [groupId, userId]);

        if (group.rowCount === 0) {
            return res.status(404).send('Group not found');
        }

        // Assign customer to group
        const result = await pool.query(`
            UPDATE customers
               SET group_id = $1
             WHERE id = $2
               AND user_id = $3
         RETURNING id, name, group_id
        `, [groupId, customerId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Customer not found');
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error assigning customer to group:', error);
        res.status(500).send('Error assigning customer to group');
    }
});


/**
 * DELETE /customer/:id/group
 * -----------------------------
 * Remove a customer from whatever group they're in (sets `group_id` to NULL).
 *
 * Auth: required. Path param `id` {number} - customer id.
 *
 * Example response (200): { "id": 7, "name": "Jane Doe", "group_id": null }
 * Response (404): "Customer not found".
 */
//@ts-ignore
router.delete('/:id/group', requireAuth, async (req: Request, res: Response) => {
    const customerId = Number(req.params.id);
    const userId = appService.getSessionUser(req);

    if (!customerId) {
        return res.status(400).send('No customer ID provided');
    }

    const pool = appService.getDatabasePool();

    try {
        const result = await pool.query(`
            UPDATE customers
               SET group_id = NULL
             WHERE id = $1
               AND user_id = $2
         RETURNING id, name, group_id
        `, [customerId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Customer not found');
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error removing customer from group:', error);
        res.status(500).send('Error removing customer from group');
    }
});


/*********************************************************
 *
 * Customer endpoints
 *
 *********************************************************/

/**
 * GET /customer
 * --------------
 * List all customers (with their group and current loan count) plus the
 * full list of tags available to the user, in one call.
 *
 * Auth: required.
 *
 * Example response (200):
 *  {
 *    "customers": [{ "id": 7, "name": "Jane Doe", "group_id": 1,
 *                     "group_name": "Class 4B", "total_books": 2 }],
 *    "tags": [{ "id": 1, "name": "VIP", "color": "#ff0000" }]
 *  }
 */
//@ts-ignore
router.get('', requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);

    try {
        const result = await client.query(`
            SELECT customers.id,
                   customers.name,
                   customers.group_id,
                   customer_groups.name AS group_name,
                   (
                       SELECT count(*)
                       FROM book_stocks
                       WHERE book_stocks.customer_id = customers.id
                   ) AS total_books
            FROM customers
             LEFT JOIN customer_groups
                       ON customer_groups.id = customers.group_id
                           AND customer_groups.user_id = customers.user_id
            WHERE customers.user_id = $1
        `, [userId]);

        // get user tags list
        const tags = await client.query(`
            SELECT id, 
                   name,
                   color
              FROM tags
               WHERE user_id = $1
        `, [userId]);

        res.status(200).json({
            customers: result.rows,
            tags: tags.rows
        });
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 * POST /customer
 * ---------------
 * Create a new customer.
 *
 * Auth: required. Body: { "name": "Jane Doe" }
 *
 * Example response (200): { "id": 7, "name": "Jane Doe", "group_id": null, "group_name": null }
 */
//@ts-ignore
router.post('', requireAuth, async (req: Request, res: Response) => {
    const name = req.body.name;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);

    try {
        console.log(`Adding customer with name ${name}`);
        const insertCustomer = await client.query(
            "INSERT INTO customers (name, user_id) VALUES ($1, $2) RETURNING id",
            [name, userId]
        );

        // fetch new data
        const result = await pool.query(`
            SELECT customers.id,
                   customers.name,
                   customers.group_id,
                   customer_groups.name AS group_name
            FROM customers
             LEFT JOIN customer_groups
                       ON customer_groups.id = customers.group_id
                           AND customer_groups.user_id = customers.user_id
            WHERE customers.id = ${insertCustomer.rows[0].id}
            AND customers.user_id = $1
        `, [userId])

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).send("Error adding the customer");
    } finally {
        client.release();
    }
});


/**
 * PUT /customer/:id
 * -------------------
 * Rename a customer.
 *
 * Auth: required. Path param `id` {number}. Body: { "name": "..." }
 *
 * Example response (200): { "id": 7, "name": "...", "group_id": 1, "group_name": "Class 4B" }
 */
//@ts-ignore
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    const customerId = req.params.id;
    if (!customerId) {
        return res.status(400).send('No customer ID provided');
    }

    const userId = appService.getSessionUser(req);

    // Body params
    const {name} = req.body;

    const pool = appService.getDatabasePool();

    try {
        console.log(`Updating customer ${customerId}`);

        const queryResult = await pool.query(
            'UPDATE customers SET name = $1 WHERE id = $2 AND user_id = $3',
            [name, customerId, userId]
        );

        if(queryResult.rowCount != 1) {
            res.status(500).send();
        }

        const customerQueryResult = await pool.query(
            `
            SELECT customers.id,
                   customers.name,
                   customers.group_id,
                   customer_groups.name AS group_name
              FROM customers
               LEFT JOIN customer_groups
                     ON customer_groups.id = customers.group_id
                         AND customer_groups.user_id = customers.user_id
             WHERE customers.id = $1
               AND customers.user_id = $2
               `,
            [customerId, userId]
        );

        res.status(200).json(customerQueryResult.rows[0]);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error updating the customer");
    }
});

/**
 * DELETE /customer/:id
 * ----------------------
 * Delete a customer.
 *
 * Auth: required. Path param `id` {number}.
 *
 * Responses: 200 {"message": "Customer deleted successfully"} | 404 {"error": "Customer not found"}.
 */
//@ts-ignore
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Delete customer, id:", id);

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);

    try {
        // Validate the existence of the book
        const customerCheck = await client.query('SELECT id FROM customers WHERE id = $1 AND user_id = $2', [id, userId]);
        if (customerCheck.rowCount === 0) {
            return res.status(404).send({error: "Customer not found"});
        }

        await client.query( 'DELETE FROM customers WHERE id = $1 AND user_id = $2', [id, userId]);

        res.send({message: "Customer deleted successfully"});
    } catch (e) {
        console.error("Error while deleting customer", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});


/**
 * GET /customer/:id/books
 * -------------------------
 * List the books a customer currently has on loan.
 *
 * Auth: required. Path param `id` {number} - customer id.
 *
 * Example response (200):
 *  [{ "id": 12, "name": "The Hobbit", "image_url": "https://...",
 *     "isbn": "9780261102217", "code": "a1b2c3d4e5" }]
 */
//@ts-ignore
router.get('/:id/books', requireAuth, async (req: Request, res: Response) => {
    const customerId = Number(req.params.id);
    if (!customerId) {
        return res.status(400).send('No customer ID provided');
    }
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        const books = await getCustomerBooks(pool, customerId, userId);
        res.status(200).json(books);
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * POST /customer/:id/add/books
 * -------------------------------
 * Lend a batch of book stocks to a customer (by scanning/typing their stock
 * codes): sets each stock's `customer_id` to this customer and its
 * `status` to 2 (booked/loaned).
 *
 * Auth: required. Path param `id` {number} - customer id.
 * Body: { "books": ["a1b2c3d4e5", "f6g7h8i9j0"] }  // array of book_stocks.code
 *
 * Example response (200): the updated list of books on loan to this customer
 * (same shape as GET /customer/:id/books).
 */
//@ts-ignore
router.post('/:id/add/books', requireAuth, async (req: Request, res: Response) => {
    const customerId = Number(req.params.id);
    const books: string[] = req.body.books;

    if (!customerId) {
        return res.status(400).send('No customer ID provided');
    }

    if (books.length === 0) {
        return res.status(400).send('No books provided');
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        for (const bookStockCode of books) {
            await pool.query(
                'UPDATE book_stocks SET customer_id = $1, status = $2 WHERE code = $3 AND user_id = $4',
                [customerId, 2, bookStockCode, userId]
            );
        }

        const customerBooks = await getCustomerBooks(pool, customerId, userId);

        res.status(200).json(customerBooks);
    } catch (err: any) {
        console.error('Error adding books to a customer', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * DELETE /customer/:id/book/:bookStockCode
 * --------------------------------------------
 * Return a single book a customer had on loan: clears its `customer_id`
 * and resets its `status` back to 0 (available).
 *
 * Auth: required. Path params: `id` {number} customer id,
 * `bookStockCode` {string} - book_stocks.code.
 *
 * Example request: DELETE /api/rest/customer/7/book/a1b2c3d4e5
 *
 * Response: 200 (empty body) on success.
 */
//@ts-ignore
router.delete('/:id/book/:bookStockCode', requireAuth, async (req: Request, res: Response) => {
    const customerId = Number(req.params.id);
    const bookStockCode = String(req.params.bookStockCode);

    if (!customerId) {
        return res.status(400).send('No customer ID provided');
    }

    if (!bookStockCode) {
        return res.status(400).send('No book stock code provided');
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        await pool.query(
            'UPDATE book_stocks SET status = $1, customer_id = $2 WHERE code = $3 AND customer_id = $4 AND user_id = $5',
            [0, null, bookStockCode, customerId, userId]
        );

        res.status(200).send();
    } catch (err: any) {
        console.error('Error adding books to a customer', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

/** Fetch the books (with stock code) currently on loan to `customerId`. */
async function getCustomerBooks(pool: Pool, customerId: number, userId: number) {
    const customerQueryResult = await pool.query(
        `SELECT books.id,
                books.name,
                books.image_url,
                books.isbn,
                book_stocks.code
              FROM book_stocks, books
             WHERE book_stocks.book_id = books.id
               AND book_stocks.user_id = $1
               AND books.user_id = $2
               AND book_stocks.customer_id = $3
               `,
        [userId, userId, customerId]
    );

   return customerQueryResult.rows;
}

export default router;