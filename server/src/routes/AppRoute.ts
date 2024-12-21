import { Router, Request, Response } from 'express';
import {appService} from "../AppService";

const router = Router();

// GET - policy conf
// /app/policy
router.get('/policy', async (req: Request, res: Response) => {

    let categories: Record<string, any>[] = [];
    let languages: Record<string, any>[] = [];

    try {
        categories = await getCategories();
    } catch (e) {
        console.error("Error when getting categories. ", e)
    }
    try {
        languages = await getLanguages();
    } catch (e) {
        console.error("Error when getting languages. ", e)
    }

    res.status(200).json({
        user: null,
        categories: categories,
        languages: languages
    });
});

/**
 *
 */
async function getCategories(): Promise<Record<string, any>[]> {
    const pool = appService.getDatabasePool();

    const query = `
        SELECT id,
               name
        FROM categories
    `
    // Use a prepared statement to fetch items by name
    console.log("executing query: ", query);
    const result = await pool.query(query);

    // Return the result (found rows)
     return result.rows;
}

/**
 *
 */
async function getLanguages(): Promise<Record<string, any>[]> {
    const pool = appService.getDatabasePool();

    const query = `
        SELECT code,
               name
        FROM languages
    `
    // Use a prepared statement to fetch items by name
    console.log("executing query: ", query);
    const result = await pool.query(query);

    // Return the result (found rows)
    return result.rows;
}

export default router;