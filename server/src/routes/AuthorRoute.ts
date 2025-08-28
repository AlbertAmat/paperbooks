import { Router, Request, Response } from 'express';
import {appService} from "../AppService";
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = Router();


/**
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
                   name
              FROM authors
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
 *
 */
//@ts-ignore
router.post('/search', requireAuth, async (req: Request, res: Response) => {
    const query = req.body.query;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);

    try {
        console.log(`search authors with query ${query}`);
        // fetch new data
        const result = await pool.query(`
            SELECT authors.id,
                   authors.name
            FROM authors
            WHERE LOWER(authors.name) ILIKE $1
            AND authors.user_id = $2
        `, [`%${query.toLocaleLowerCase()}%`, userId])

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).send("Error searching the authors");
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
        console.log(`Adding author with name ${name}`);
        const insertAuthor = await client.query(
            "INSERT INTO authors (name, user_id) VALUES ($1, $2) RETURNING id",
            [name, userId]
        );

        // fetch new data
        const result = await pool.query(`
            SELECT authors.id,
                   authors.name
            FROM authors
            WHERE authors.id = ${insertAuthor.rows[0].id}
            AND authors.user_id = $1
        `, [userId])

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).send("Error adding the author");
    } finally {
        client.release();
    }
});


/**
 *
 */
//@ts-ignore
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    const authorId = req.params.id;
    if (!authorId) {
        return res.status(400).send('No author ID provided');
    }

    const userId = appService.getSessionUser(req);

    // Body params
    const {name} = req.body;

    const pool = appService.getDatabasePool();

    try {
        console.log(`Updating author ${authorId}`);

        const queryResult = await pool.query(
            'UPDATE authors SET name = $1 WHERE id = $2 AND user_id = $3',
            [name, authorId, userId]
        );

        if(queryResult.rowCount != 1) {
            res.status(500).send();
        }

        const authorQueryResult = await pool.query(
            `SELECT authors.id,
                    authors.name
              FROM authors
             WHERE authors.id = $1
               AND authors.user_id = $2
               `,
            [authorId, userId]
        );

        res.status(200).json(authorQueryResult.rows[0]);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error updating the author");
    }
});

/**
 *
 */
//@ts-ignore
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Delete author, id:", id);

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);

    try {
        // Validate the existence of the book
        const authorCheck = await client.query('SELECT id FROM authors WHERE id = $1 AND user_id = $2', [id, userId]);
        if (authorCheck.rowCount === 0) {
            return res.status(404).send({error: "Author not found"});
        }

        await client.query( 'DELETE FROM authors WHERE id = $1 AND user_id = $2', [id, userId]);

        res.send({message: "Author deleted successfully"});
    } catch (e) {
        console.error("Error while deleting author", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

export default router;