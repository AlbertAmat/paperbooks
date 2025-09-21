import {Router, Request, Response} from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";
import {Pool} from "pg";

const router = Router();

/**
 * Path: /location
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
                   description,
                   (SELECT COUNT(*) FROM book_stocks WHERE book_stocks.location_id = locations.id) total_books
            FROM locations
            WHERE user_id = $1
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 * Path: /location/id/books
 */
//@ts-ignore
router.get('/:id/books', requireAuth, async (req: Request, res: Response) => {
    const locationId = Number(req.params.id);
    if (!locationId) {
        return res.status(400).send('No location ID provided');
    }
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        const locationBooks = await getLocationBooks(pool, locationId, userId);
        res.status(200).json(locationBooks);
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
    const locationId = Number(req.params.id);
    const books: string[] = req.body.books;

    if (!locationId) {
        return res.status(400).send('No location ID provided');
    }

    if (books.length === 0) {
        return res.status(400).send('No books provided');
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        const exist = await existLocation(pool, locationId, userId);
        if (!exist) {
            res.status(404).send('Location does not exist');
        }

        for (const bookStockCode of books) {
            await pool.query(
                'UPDATE book_stocks SET location_id = $1 WHERE code = $2 AND user_id = $3',
                [locationId, bookStockCode, userId]
            );
        }

        const locationBooks = await getLocationBooks(pool, locationId, userId);

        res.status(200).json(locationBooks);
    } catch (err: any) {
        console.error('Error adding books to a location', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

/**
 *
 */
//@ts-ignore
router.post('', requireAuth, async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);

    try {
        console.log(`Adding location with name ${name}`);
        const insertLocation = await client.query(
            "INSERT INTO locations (name, description, user_id) VALUES ($1, $2, $3) RETURNING id",
            [name, description, userId]
        );

        // fetch new data
        const result = await pool.query(`
            SELECT locations.id,
                   locations.name,
                   locations.description,
                   (SELECT COUNT(*) FROM book_stocks WHERE book_stocks.location_id = locations.id) total_books
            FROM locations
            WHERE locations.id = ${insertLocation.rows[0].id}
              AND locations.user_id = $1
        `, [userId])

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).send("Error adding the location");
    } finally {
        client.release();
    }
});


/**
 *
 */
//@ts-ignore
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    const locationId = req.params.id;
    if (!locationId) {
        return res.status(400).send('No location ID provided');
    }

    const userId = appService.getSessionUser(req);

    // Body params
    const {
        name,
        description
    } = req.body;

    const pool = appService.getDatabasePool();

    try {
        console.log(`Updating location ${locationId}`);

        const queryResult = await pool.query(
            'UPDATE locations SET name = $1, description = $2 WHERE id = $3 AND user_id = $4',
            [name, description, locationId, userId]
        );

        if (queryResult.rowCount != 1) {
            res.status(500).send();
        }

        const locationQueryResult = await pool.query(
            `SELECT locations.id,
                    locations.name,
                    locations.description,
                    (SELECT COUNT(*) FROM book_stocks WHERE book_stocks.location_id = locations.id) total_books
             FROM locations
             WHERE locations.id = $1
               AND locations.user_id = $2
            `,
            [locationId, userId]
        );

        res.status(200).json(locationQueryResult.rows[0]);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error updating the location");
    }
});

/**
 *
 */
//@ts-ignore
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);

    try {
        // Validate the existence of the book
        const locationCheck = await client.query('SELECT id FROM locations WHERE id = $1 AND user_id = $2', [id, userId]);
        if (locationCheck.rowCount === 0) {
            return res.status(404).send({error: "Location not found"});
        }

        await client.query('DELETE FROM locations WHERE id = $1 AND user_id = $2', [id, userId]);

        res.send({message: "Location deleted successfully"});
    } catch (e) {
        console.error("Error while deleting location", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

async function existLocation(pool: Pool, locationId: number, userId: number): Promise<boolean> {
    const queryResult = await pool.query(
        'SELECT id FROM locations WHERE id = $1 AND user_id = $2',
        [locationId, userId]
    );

    return queryResult.rowCount == 1;
}

async function getLocationBooks(pool: Pool, locationId: number, userId: number) {
    const result = await pool.query(`
            SELECT book_stocks.id,
                   books.name,
                   books.id as book_id,
                   book_stocks.code,
                   book_stocks.status,
                   books.image_url
            FROM book_stocks,
                 books
            WHERE book_stocks.location_id = $1
              AND book_stocks.book_id = books.id
              AND book_stocks.user_id = $2
        `, [locationId, userId]);

    return result.rows;
}

export default router;