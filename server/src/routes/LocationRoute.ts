import { Router, Request, Response } from 'express';
import {requireAuth} from "../middlewares/AuthMiddleware";

const router = Router();

/**
 * Path: /location
 */
//@ts-ignore
router.get('', requireAuth, async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 *
 */
//@ts-ignore
router.put('/{id}', requireAuth, async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 *
 */
//@ts-ignore
router.delete('/{id}', requireAuth, async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

export default router;