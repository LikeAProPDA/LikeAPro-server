import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middleware/errorHandler/errorHandler.js";
import userRouter from "./router/userRouter.js";
import qaCommentRouter from "./router/qaCommentRouter.js";
import dbSetUp from "./db/dbSetUp.js";
import cookieParser from "cookie-parser";
import qasRouter from "./router/qasRouter.js";

// 환경 변수 사용
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// CORS 설정, 클라이언트 HOST와 맞추어야 함
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Router
app.use("/api/users", userRouter);
app.use("/api/qas", qaCommentRouter);
// 에러 핸들링 미들웨어 -> 앱 전체적으로 검사하므로 맨 마지막에 배치해야함
app.use(errorHandler);

const SERVER_PORT = process.env.SERVER_PORT;

// DB ENV
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_COLLECTION = process.env.DB_COLLECTION;

app.listen(SERVER_PORT, () => {
  console.log(`Server Listening on Port ${SERVER_PORT}`);
  dbSetUp(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_COLLECTION);
});
