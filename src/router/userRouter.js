import express from 'express';
import { signUp } from '../service/userService.js';
import { ApplicationError } from '../util/error/applicationError.js';
const router = express.Router();

// 리퀘스트를 받으면 response를 주는역할

router.post('/sign-up', async (req, res, next) => {
    try {
        const { email, nickname, password, backjoonId } = req.body;
        const result = await signUp(email, nickname, password, backjoonId);
        res.status(200).json({
            sucess: true,
            message: 'Sign Up Success',
            status: 201,
            result: result,
        });
    } catch (err) {
        console.error(err);
        next(new ApplicationError(400, "can't sign up"));
    }
});
export default router;
