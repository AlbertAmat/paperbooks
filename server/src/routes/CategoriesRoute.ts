import { Router, Request, Response } from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";

const router = Router();

/**

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
              FROM categories
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
router.post('', requireAuth, async (req: Request, res: Response) => {
    const name = req.body.name;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);

    try {
        console.log(`Adding category with name ${name}`);
        const insertCategory = await client.query(
            "INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id",
            [name, userId]
        );

        // fetch new data
        const result = await pool.query(`
            SELECT categories.id,
                   categories.name
            FROM categories
            WHERE categories.id = $1
              AND categories.user_id = $2
        `, [insertCategory.rows[0].id, userId])

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).send("Error adding category");
    } finally {
        client.release();
    }
});


/**
 *
 */
//@ts-ignore
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).send('No category ID provided');
    }

    const userId = appService.getSessionUser(req);

    // Body params
    const {
        name
    } = req.body;

    const pool = appService.getDatabasePool();

    try {
        console.log(`Updating category ${categoryId}`);

        const queryResult = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3',
            [name, categoryId, userId]
        );

        if(queryResult.rowCount != 1) {
            res.status(500).send();
        }

        const categoryQueryResult = await pool.query(
            `SELECT categories.id,
                    categories.name
              FROM categories
             WHERE categories.id = $1
               AND categories.user_id = $2
             `,
            [categoryId, userId]
        );

        res.status(200).json(categoryQueryResult.rows[0]);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error updating the category");
    }
});

/**
 *
 */
//@ts-ignore
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Delete category, id:", id);

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);

    try {
        // Validate the existence of the book
        const categoryCheck = await client.query(
            'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (categoryCheck.rowCount === 0) {
            return res.status(404).send({error: "Category not found"});
        }

        await client.query( 'DELETE FROM categories WHERE id = $1 AND user_id = $2', [id, userId]);

        res.send({message: "Category deleted successfully"});
    } catch (e) {
        console.error("Error while deleting category", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

export default router;