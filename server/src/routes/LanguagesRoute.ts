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
            SELECT code, 
                   name
              FROM languages
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
    const code = req.body.code;
    const name = req.body.name;

    if(!code || !name) {
        return res.status(400).send('No code or language name provided');
    }

    if(code.length > 2) {
        res.status(400).send("Language code must be 2 characters")
    }

    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        console.log(`Adding language with name ${name}`);
        await client.query(
            "INSERT INTO languages (code, name) VALUES ($1, $2)",
            [code, name]
        );

        res.status(200).send();
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
router.put('/:code', requireAuth, async (req: Request, res: Response) => {
    const code = req.params.code;
    if (!code) {
        return res.status(400).send('No language code provided');
    }

    // Body params
    const {name} = req.body;

    const pool = appService.getDatabasePool();

    try {
        console.log(`Updating language ${code}`);

        const queryResult = await pool.query(
            'UPDATE languages SET name = $1 WHERE code = $2',
            [name, code]
        );

        if(queryResult.rowCount != 1) {
            res.status(500).send();
        }

        res.status(200).send();
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error updating language");
    }
});

/**
 *
 */
//@ts-ignore
router.delete('/:code', requireAuth, async (req: Request, res: Response) => {
    const code = String(req.params.code);
    console.log("Delete language, code:", code);

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        // Validate the existence of the book
        const languageCheck = await client.query('SELECT code FROM languages WHERE code = $1', [code]);
        if (languageCheck.rowCount === 0) {
            return res.status(404).send({error: "Language not found"});
        }

        await client.query( 'DELETE FROM languages WHERE code = $1', [code]);

        res.send({message: "Language deleted successfully"});
    } catch (e) {
        console.error("Error while deleting language", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

export default router;