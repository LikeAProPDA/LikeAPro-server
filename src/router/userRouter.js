import express from 'express';
import {
    isExistByBackjoonId,
    isExistByNickname,
    isVerifyEmail,
    login,
    sendVerificationMail,
    signUp,
} from '../service/userService.js';
import authHandler from '../middleware/authHandler/authHandler.js';
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

router.get('/duplicate-nickname', async (req, res, next) => {
    const { nickname } = req.query;
    const isDuplicate = (await isExistByNickname(nickname)) ? true : false;
    res.status(200).json({
        success: true,
        message: 'Duplicate Nickname API Invoked',
        result: {
            nickname: nickname,
            isDuplicate: isDuplicate,
        },
    });
});

// 이메일 인증 보내기
router.post('/verify-email', async (req, res, next) => {
    try {
        const { email } = req.query;
        const result = await sendVerificationMail(email);

        res.cookie('emailToken', result.emailToken, {
            httpOnly: true,
            maxAge: result.maxAge,
            // secure: true // if https
        });

        res.status(200).json({
            success: true,
            message: 'send verification email',
            result: {
                targetEmail: email,
                maxAge: result.maxAge,
            },
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

// 이메일 인증 확인
router.get('/verify-email', async (req, res, next) => {
    try {
        const { email, code } = req.query;
        const emailToken = req.cookies.emailToken;

        const result = await isVerifyEmail(email, code, emailToken);
        return res.status(200).send({
            success: true,
            message: 'Call Verify Email API',
            result: {
                targetEmail: email,
                isVerify: result,
            },
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.get('/duplicate-backjoonid', async (req, res, next) => {
    try {
        const backjoonId = req.query.backjoonid;
        const isDuplicate = (await isExistByBackjoonId(backjoonId)) ? true : false;
        res.status(200).json({
            success: true,
            message: 'Duplicate Nickname API Invoked',
            result: {
                backjoonId: backjoonId,
                isDuplicate: isDuplicate,
            },
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

export default router;
