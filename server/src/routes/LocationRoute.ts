import { Router, Request, Response } from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";

const router = Router();

/**
 * Path: /location
 */
//@ts-ignore
router.get('', requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT id, 
                   name, 
                   description
              FROM locations
        `);
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
    const description = req.body.description;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        console.log(`Adding location with name ${name}`);
        const insertLocation = await client.query(
            "INSERT INTO locations (name, description) VALUES ($1, $2) RETURNING id",
            [name, description]
        );

        // fetch new data
        const result = await pool.query(`
            SELECT locations.id,
                   locations.name,
                   locations.description
            FROM locations
            WHERE locations.id = ${insertLocation.rows[0].id}
        `)

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

    // Body params
    const {
        name,
        description
    } = req.body;

    const pool = appService.getDatabasePool();

    try {
        console.log(`Updating location ${locationId}`);

        const queryResult = await pool.query(
            'UPDATE locations SET name = $1, description = $2 WHERE id = $3',
            [name, description, locationId]
        );

        if(queryResult.rowCount != 1) {
            res.status(500).send();
        }

        const locationQueryResult = await pool.query(
            `SELECT locations.id,
                    locations.name,
                    locations.description
              FROM locations
             WHERE locations.id = $1`,
            [locationId]
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
    console.log("Delete location, id:", id);

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        // Validate the existence of the book
        const locationCheck = await client.query('SELECT id FROM locations WHERE id = $1', [id]);
        if (locationCheck.rowCount === 0) {
            return res.status(404).send({error: "Location not found"});
        }

        await client.query( 'DELETE FROM locations WHERE id = $1', [id]);

        res.send({message: "Location deleted successfully"});
    } catch (e) {
        console.error("Error while deleting location", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

export default router;