import { Router, Request, Response } from 'express';
import {appService} from "../AppService";

const router = Router();

router.get('/search', async (req: Request, res: Response) => {
    const query = req.query.query;
    console.log("Search authors by ", query);

    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        const result = await client.query(`
            SELECT id, name FROM authors WHERE name ILIKE $1
        `, ['%'+query+'%']);

        res.status(200).json(result.rows);
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

export default router;