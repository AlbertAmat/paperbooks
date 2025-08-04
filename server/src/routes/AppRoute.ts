import express, { Router, Request, Response } from 'express';
import {appService} from "../AppService";
import {requireAuth} from "../middlewares/AuthMiddleware";
import path from "path";
import jwt from "jsonwebtoken";

const router = Router();

// GET - policy conf
// /app/policy
//@ts-ignore
router.get('/policy', requireAuth, async (req: Request, res: Response) => {
    let categories: Record<string, any>[] = [];
    let languages: Record<string, any>[] = [];
    let formats: Record<string, any>[] = [];
    let locations: Record<string, any>[] = [];

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

    try {
        formats = await getFormats();
    } catch (e) {
        console.error("Error when getting formats. ", e)
    }

    try {
        locations = await getLocations();
    } catch (e) {
        console.error("Error when getting locations. ", e)
    }

    const user = await  getUser(req);

    res.status(200).json({
        user:user,
        categories: categories,
        languages: languages,
        formats: formats,
        locations: locations,
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
async function getLocations(): Promise<Record<string, any>[]> {
    const pool = appService.getDatabasePool();

    const query = `
        SELECT id,
               name,
               description
        FROM locations
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
async function getUser(req: Request): Promise<Record<string, any>[]> {
   const userId = appService.getSessionUser(req);

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
    `
    // Use a prepared statement to fetch items by name
    console.log("executing query: ", query);
    const result = await pool.query(query, [userId]);

    console.log(" result.rows[0]", result.rows[0])
    // Return the result (found rows)
    return result.rows[0];
}


export default router;