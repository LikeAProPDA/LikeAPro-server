import { ApplicationError } from '../../util/error/applicationError.js';
import { parseToken } from '../../util/jwt/jwtUtil.js';

const authHandler = (req, res, next) => {
    const user = parseToken(req.cookies.authToken);
    if (user) {
        req.user = user;
        return next();
    }

    // 로그인 정보 실패 로직
    if (req.originalUrl === '/api/users/login' && req.method === 'GET') {
        return res.status(401).json({
            success: false,
            message: 'is not login user',
            result: {
                isLogin: false,
            },
        });
    }

    return next(new ApplicationError(401, 'UnAuthorized'));
};

export default authHandler;
