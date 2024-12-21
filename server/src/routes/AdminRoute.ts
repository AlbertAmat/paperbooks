import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Path: /admin/users
 */
router.get('/users', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 * Path: /admin/user
 */
router.post('/user', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 * Path: /admin/user/{id}
 */
router.put('/user/{id}', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});

/**
 * Path: /admin/user/{id}
 */
router.delete('/user/{id}', async (req: Request, res: Response) => {
    res.status(200).json("all ok");
});


export default router;