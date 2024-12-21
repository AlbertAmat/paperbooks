import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Path: /location
 */
router.get('', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 * Path: /location
 */
router.post('', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 *
 */
router.put('/{id}', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 *
 */
router.delete('/{id}', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

export default router;