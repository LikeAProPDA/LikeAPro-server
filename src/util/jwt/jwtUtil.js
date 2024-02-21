import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const key = process.env.JWT_SECRET_KEY;
if (!key) throw Error("Can't get jwt secret key");

const issuer = process.env.JWT_ISSUER;
if (!issuer) throw Error("Can't Get jwt issue");

const generateJwt = (visibleUser, maxAge) => {
    const token = jwt.sign(visibleUser, key, {
        expiresIn: maxAge / 1000,
        issuer: issuer,
    });

    return token;
};

const parseToken = (token) => {
    if (!token) {
        return null;
    }

    const info = jwt.verify(token, key);
    return {
        id: info.id,
        nickname: info.nickname,
        backjoonId: info.backjoonId,
        createdAt: info.createdAt,
    };
};

export { generateJwt, parseToken };
