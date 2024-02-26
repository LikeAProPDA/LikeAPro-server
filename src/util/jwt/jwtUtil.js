import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const userKey = process.env.JWT_USER_SECRET_KEY;
const emailKey = process.env.JWT_EMAIL_SECRET_KEY;
if (!userKey) throw Error("Can't get jwt secret key");
if (!emailKey) throw Error("Can't get jwt secret key");

const issuer = process.env.JWT_ISSUER;
if (!issuer) throw Error("Can't Get jwt issue");

const generateUserJwt = (visibleUser, maxAge) => {
    return generateJwt(visibleUser, maxAge, userKey);
};

const generateEmailJwt = (authEmailObj, maxAge) => {
    return generateJwt(authEmailObj, maxAge, emailKey);
};

const generateJwt = (obj, maxAge, key) => {
    const token = jwt.sign(obj, key, {
        expiresIn: maxAge / 1000,
        issuer: issuer,
    });

    return token;
};

const parseAuthToken = (token) => {
    const result = parseToken(token, userKey);

    if (!result) return null;

    return {
        id: result.id,
        nickname: result.nickname,
        backjoonId: result.backjoonId,
        createdAt: result.createdAt,
        email: result.email,
    };
};

const parseEmailToken = (token) => {
    const result = parseToken(token, emailKey);

    if (!result) return null;

    return {
        email: result.email,
        verifyCode: result.verifyCode,
    };
};

const parseToken = (token, key) => {
    if (!token) {
        return null;
    }

    const info = jwt.verify(token, key);
    return info;
};

export { generateJwt, parseToken, generateUserJwt, generateEmailJwt, parseAuthToken, parseEmailToken };
