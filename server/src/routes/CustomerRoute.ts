import { Router, Request, Response } from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";
import {Pool} from "pg";

const router = Router();

/**
 * Get all the list of customers
 * Path: /customer
 */
//@ts-ignore
router.get('', requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);

    try {
        const result = await client.query(`
            SELECT id, 
                   name,
                   (SELECT count(*) FROM book_stocks WHERE book_stocks.customer_id = customers.id) total_books
              FROM customers
               WHERE user_id = $1
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
 *
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
                   customers.name
            FROM customers
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
 *
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
            `SELECT customers.id,
                    customers.name
              FROM customers
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
 *
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
 * Path: /customer/id/books
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
 * Path: /location/id/add/books
 *
 * Add books stock codes into a location. Used to movea stack of books between locations
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
 * Path: /location/id/books/bookStockCode
 *
 *
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

/**
 *
 * @param pool
 * @param customerId
 * @param userId
 */
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