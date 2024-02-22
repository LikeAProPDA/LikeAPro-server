import express from 'express';
import { login, signUp } from '../service/userService.js';
import authHandler from '../middleware/authHandler/authHandler.js';
import { ApplicationError } from '../util/error/applicationError.js';
const router = express.Router();

router.post('/sign-up', async (req, res, next) => {
    try {
        const { email, nickname, password, backjoonId } = req.body;
        const result = await signUp(email, nickname, password, backjoonId);

        return res.status(201).json({
            sucess: true,
            message: 'Sign Up Success',
            result: result,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const loginInfo = await login(email, password);

        res.cookie('authToken', loginInfo.accessToken, {
            httpOnly: true,
            maxAge: loginInfo.maxAge,
            // secure: true // if https
        });

        res.status(201).json({
            success: true,
            message: 'Login Success',
            result: loginInfo.user,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/logout', authHandler, async (req, res) => {
    res.clearCookie('authToken');
    res.status(200).send({ success: true, message: 'Logout Success' });
});

// 성공했을 경우 로직, 실패했을 경우 authHandler에서 처리 (이 경우만 특별하게)
router.get('/login', authHandler, async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'login user',
        result: {
            user: req.user,
            isLogin: true,
        },
    });
});

export default router;
