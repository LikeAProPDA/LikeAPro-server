import express from 'express';
import authHandler from '../middleware/authHandler/authHandler.js';
import { getAllPlayground, getPlaygroundById, postPlayground } from '../service/playgroundService.js';

const router = express.Router();

router.post('/', authHandler, async (req, res, next) => {
    try {
        const { code, title, description } = req.body;
        const result = await postPlayground(req.user.id, code, title, description);

        return res.status(201).json({
            success: true,
            message: 'post playground success',
            result: result,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const result = await getAllPlayground();
        return res.status(200).json({
            success: true,
            message: 'get playground list success',
            result: result,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await getPlaygroundById(req.params.id);
        res.status(200).json({
            success: true,
            message: '성공하였음',
            result: result,
        });
    } catch (err) {
        return next(err);
    }
});

export default router;
