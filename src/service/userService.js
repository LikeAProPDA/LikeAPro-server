import validator from "validator";
import { ApplicationError } from "../util/error/applicationError.js";
import UserModel from "../db/models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { generateJwt } from "../util/jwt/jwtUtil.js";

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
    nickname: result.nickname,
    backjoonId: result.backjoonId,
    profile: result.profile,
    createdAt: result.createdAt,
  };
};

const login = async (email, password) => {
  if (!validator.isEmail(email) || !(await isExistByEmail(email))) {
    throw new ApplicationError(400, "이메일 혹은 비밀번호가 옳지 않습니다.");
  }

  const user = await UserModel.findOne({
    email: email,
  });

  if (
    !password ||
    !(await bcrypt.compare(password.toString(), user.password))
  ) {
    throw new ApplicationError(400, "이메일 혹은 비밀번호가 옳지 않습니다.");
  }

  const visibleUser = {
    id: user._id,
    nickname: user.nickname,
    backjoonId: user.backjoonId,
    profile: user.profile,
    createdAt: user.createdAt,
  };

  // 3일
  const maxAge = 1000 * 60 * 60 * 24 * 3;

  return {
    accessToken: generateJwt(visibleUser, maxAge),
    maxAge: maxAge,
    user: visibleUser,
  };
};

const toHashedPassword = async (password) => {
  const saltRound = Number(process.env.SALT_ROUND);
  if (saltRound === -1) throw new ApplicationError(500, "Sign Up Error");
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const validateEmail = async (email) => {
  if (!email || !validator.isEmail(email))
    throw new ApplicationError(400, "올바른 이메일 형식이 아닙니다.");
  if (await isExistByEmail(email))
    throw new ApplicationError(400, "해당 이메일은 이미 사용 중 입니다.");
};

const validateNickname = async (nickname) => {
  if (
    !nickname ||
    !validator.isLength(nickname.toString(), { min: 2, max: 12 })
  ) {
    throw new ApplicationError(
      400,
      "닉네임 길이는 2~12 글자 사이로 설정해야합니다."
    );
  }

  if (await isExistByNickname(nickname))
    throw new ApplicationError(400, "해당 닉네임은 이미 사용 중 입니다.");
};

const validatePassword = (password) => {
  if (
    !password ||
    !validator.isLength(password.toString(), { min: 8, max: 50 })
  )
    throw new ApplicationError(400, "비밀번호는 최소 8자 이상이어야 합니다.");
};

const validateBackjoonId = async (backjoonId) => {
  if (!backjoonId)
    throw new ApplicationError(400, "올바른 백준 아이디를 입력해주세요.");

  if (await isExistByBackjoonId(backjoonId.toString()))
    throw new ApplicationError(400, "해당 백준 아이디는 이미 사용 중입니다.");
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

export { signUp, login };
