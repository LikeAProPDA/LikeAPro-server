import validator from 'validator';
import { ApplicationError } from '../util/error/applicationError.js';
import UserModel from '../db/models/userModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { generateEmailJwt, parseEmailToken, generateUserJwt } from '../util/jwt/jwtUtil.js';
import { sendEmail } from '../util/mail/mailSender.js';

dotenv.config();

const signUp = async (email, nickname, password, backjoonId) => {
    // validate
    await validateEmail(email);
    await validateNickname(nickname);
    await validatePassword(password);
    await validateBackjoonId(backjoonId);

    // salt
    const hashedPassword = await toHashedPassword(password);

    // save
    const user = new UserModel({
        email: email,
        nickname: nickname,
        password: hashedPassword,
        backjoonId: backjoonId,
    });

    const result = await user.save();
    return {
        id: result._id,
        email: result.email,
        nickname: result.nickname,
        backjoonId: result.backjoonId,
        profile: result.profile,
        createdAt: result.createdAt,
    };
};

const login = async (email, password) => {
    if (!validator.isEmail(email) || !(await isExistByEmail(email))) {
        throw new ApplicationError(400, '이메일 혹은 비밀번호가 옳지 않습니다.');
    }

    const user = await UserModel.findOne({
        email: email,
    });

    if (!password || !(await bcrypt.compare(password.toString(), user.password))) {
        throw new ApplicationError(400, '이메일 혹은 비밀번호가 옳지 않습니다.');
    }

    const visibleUser = {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        backjoonId: user.backjoonId,
        profile: user.profile,
        createdAt: user.createdAt,
    };

    // 3일
    const maxAge = 1000 * 60 * 60 * 24 * 3;

    return {
        accessToken: generateUserJwt(visibleUser, maxAge),
        maxAge: maxAge,
        user: visibleUser,
    };
};

// 인증 이메일 보내기
const sendVerificationMail = async (email) => {
    await validateEmail(email);

    let verifyCode = makeVerifyCode();

    // 3분
    const maxAge = 1000 * 60 * 3;

    // 개선점
    const html = `
        <!DOCTYPE html>
        <html> 
            <head>
                <meta charset='utf-8'/>
            </head>
            <body>
                <div>이메일: ${email}</div>
                <div>인증코드: ${verifyCode}</div>
                <small>해당 인증코드를 3분 이내에 입력하여 주세요</small>
            </body>
        </html>
    `;

    sendEmail({
        to: email,
        subject: 'Like A Pro: 이메일 인증',
        html: html,
    });

    return {
        emailToken: generateEmailJwt(
            {
                email: email,
                verifyCode: verifyCode,
            },
            maxAge
        ),
        maxAge: maxAge,
    };
};

// 이메일 인증 확인
const isVerifyEmail = async (email, code, emailToken) => {
    await validateEmail(email);
    if (!code || !emailToken) throw new ApplicationError(400, '이메일 인증 진행할 수 없음');

    const verifyEmailObj = parseEmailToken(emailToken);

    return verifyEmailObj.email === email && code === verifyEmailObj.verifyCode;
};

const toHashedPassword = async (password) => {
    const saltRound = Number(process.env.SALT_ROUND);
    if (saltRound === -1) throw new ApplicationError(500, 'Sign Up Error');
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

const validateEmail = async (email) => {
    if (!email || !validator.isEmail(email)) throw new ApplicationError(400, '올바른 이메일 형식이 아닙니다.');
    if (await isExistByEmail(email)) throw new ApplicationError(400, '해당 이메일은 이미 사용 중 입니다.');
};

const validateNickname = async (nickname) => {
    if (!nickname || !validator.isLength(nickname.toString(), { min: 2, max: 12 })) {
        throw new ApplicationError(400, '닉네임 길이는 2~12 글자 사이로 설정해야합니다.');
    }

    if (await isExistByNickname(nickname)) throw new ApplicationError(400, '해당 닉네임은 이미 사용 중 입니다.');
};

const validatePassword = (password) => {
    if (!password || !validator.isLength(password.toString(), { min: 8, max: 50 }))
        throw new ApplicationError(400, '비밀번호는 최소 8자 이상이어야 합니다.');
};

const validateBackjoonId = async (backjoonId) => {
    if (!backjoonId) throw new ApplicationError(400, '올바른 백준 아이디를 입력해주세요.');

    if (await isExistByBackjoonId(backjoonId.toString()))
        throw new ApplicationError(400, '해당 백준 아이디는 이미 사용 중입니다.');
};

const isExistByEmail = async (email) => {
    const result = await UserModel.exists({ email: email });
    return result;
};

const isExistByNickname = async (nickname) => {
    const result = await UserModel.exists({ nickname: nickname });

    return result;
};

const isExistByBackjoonId = async (backjoonId) => {
    const result = await UserModel.exists({ backjoonId: backjoonId });
    return result;
};

const makeVerifyCode = () => {
    let verifyCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // make verify code
    for (let i = 0; i < 6; i++) {
        verifyCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return verifyCode;
};

export { signUp, login, isExistByNickname, isExistByBackjoonId, sendVerificationMail, isVerifyEmail };
