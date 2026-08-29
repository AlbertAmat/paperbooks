import {Router, Request, Response} from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";
import {appService} from "../AppService";
import multer from "multer";

const router = Router();

// Multer setup - store in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024}, // 2MB
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: any, acceptFile: boolean) => void) => {
        // @ts-ignore
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
            return cb(new Error("Only PNG or JPG images are allowed"), false);
        }
        cb(null, true);
    }
});

// POST /image
router.post("/image", requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        if (!req.file) {
            return res.status(400).json({error: "No PNG file uploaded or file too large"});
        }

        // Update user image in DB
        await client.query(`
                    UPDATE users
                    SET image = $1
                    WHERE id = $2
            `,
            [req.file.buffer, appService.getSessionUser(req)] // req.user.id comes from requireAuth
        );

        res.status(200).json({message: "Image uploaded successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

router.delete("/image", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        await client.query(`
                    UPDATE users
                    SET image = null
                    WHERE id = $1
            `,
            [appService.getSessionUser(req)] // req.user.id comes from requireAuth
        );

        res.status(200).json({message: "Image removed successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

router.put("", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);
    try {
        // Body params
        const {name, email, language, region} = req.body;

        await client.query(`
                    UPDATE users
                    SET name = $1, 
                        email = $2,
                        language = $3,
                        region = $4
                    WHERE id = $5
            `,
            [name, email, language, region, userId]
        );

        res.status(200).json({message: "User updated successfully"});
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

router.delete("", requireAuth, async (req: Request, res: Response) => {
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);
    try {
        await client.query(`DELETE FROM users WHERE id = $1`,
            [userId]
        );

        return res.redirect("/login"); // Redirect to login page if user is not logged in
    } catch (err: any) {
        console.error("Error executing query", err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

router.post("/password", requireAuth, async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);
    try {
        const userQuery = "SELECT password FROM users WHERE id = $1";
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({message: "Invalid username or password."});
        }

        const user = userResult.rows[0];

        const comparePassword = await appService.comparePassword(currentPassword, user.password);
        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid current password." });
        }

        // Password rules
        const hasMinLength = newPassword.length >= 8;
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

        const errors: string[] = [];
        if (!hasMinLength) errors.push("At least 8 characters");
        if (!hasUppercase) errors.push("At least one uppercase letter");
        if (!hasNumber) errors.push("At least one number");
        if (!hasSpecialChar) errors.push("At least one special character");

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet the requirements",
                missing: errors
            });
        }

        const newHashedPassword = await appService.hashPassword(newPassword);
        await client.query(
            `UPDATE users SET password = $1 WHERE id = $2`,
            [newHashedPassword, userId]
        );

        return res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err: any) {
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

export default router;