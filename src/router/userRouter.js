import express from 'express';

const router = express.Router();

router.get('/sign-up', (req, res, next) => {
    console.log('yes');
    res.send('yes');
});

export default router;
