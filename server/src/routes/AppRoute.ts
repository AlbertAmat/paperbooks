import { Router, Request, Response } from 'express';
import {appService} from "../AppService";
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = Router();

// GET - policy conf
// /app/policy
//@ts-ignore
router.get('/policy', requireAuth, async (req: Request, res: Response) => {
    const userId = appService.getSessionUser(req)

    let categories: Record<string, any>[] = [];
    let languages: Record<string, any>[] = [];
    let formats: Record<string, any>[] = [];
    let locations: Record<string, any>[] = [];
    let customers: Record<string, any>[] = [];

    try {
        categories = await getCategories(userId);
    } catch (e) {
        console.error("Error when getting categories. ", e)
    }

    try {
        languages = await getLanguages();
    } catch (e) {
        console.error("Error when getting languages. ", e)
    }

    try {
        formats = await getFormats();
    } catch (e) {
        console.error("Error when getting formats. ", e)
    }

    try {
        locations = await getLocations(userId);
    } catch (e) {
        console.error("Error when getting locations. ", e)
    }

    try {
        customers = await getCustomers(userId);
    } catch (e) {
        console.error("Error when getting customers. ", e)
    }


    const user = await  getUser(userId);

    res.status(200).json({
        user:user,
        categories: categories,
        languages: languages,
        formats: formats,
        locations: locations,
        customers: customers,
    });
});

/**
 *
 */
async function getCustomers(userId: number): Promise<Record<string, any>[]> {
    const pool = appService.getDatabasePool();

    const query = `
        SELECT id,
               name
        FROM customers
        WHERE user_id = $1
    `
    // Use a prepared statement to fetch items by name
    console.log("executing query: ", query);
    const result = await pool.query(query, [userId]);

    // Return the result (found rows)
    return result.rows;
}


/**
 *
 */
async function getCategories(userId: number): Promise<Record<string, any>[]> {
    const pool = appService.getDatabasePool();

    const query = `
        SELECT id,
               name
        FROM categories
        WHERE user_id = $1
    `
    // Use a prepared statement to fetch items by name
    console.log("executing query: ", query);
    const result = await pool.query(query, [userId]);

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

/**
 *
 */
async function getFormats(): Promise<Record<string, any>[]> {
    const pool = appService.getDatabasePool();

    const query = `
        SELECT id,
               name
        FROM formats
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
async function getLocations(userId: number): Promise<Record<string, any>[]> {
    const pool = appService.getDatabasePool();
    const query = `
        SELECT id,
               name,
               description
        FROM locations
        WHERE user_id = $1
    `
    // Use a prepared statement to fetch items by name
    console.log("executing query: ", query);
    const result = await pool.query(query, [userId]);

    // Return the result (found rows)
    return result.rows;
}

/**
 *
 */
async function getUser(userId: number): Promise<Record<string, any>> {
    const pool = appService.getDatabasePool();

    const query = `
        SELECT code,
               name,
               email,
            language,
            region,
            image
        FROM users
        WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    if (user.image) {
        // Convert Buffer to base64 string with data URL prefix
        const base64Image = user.image.toString('base64');

        // You can detect the mime type or hardcode it if you know it’s PNG or JPEG
        // For example, assume PNG here:
        user.image = `data:image/png;base64,${base64Image}`;
    } else {
        user.image = null; // or a default image URL/base64 string
    }

    return user;
}

export default router;