import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/errorHandler/errorHandler.js';
import userRouter from './router/userRouter.js';
import qasRouter from './router/qasRouter.js';

// 환경 변수 사용
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정, 클라이언트 HOST와 맞추어야 함
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    })
);

// Router
app.use('/api/users', userRouter);
app.use('/api/qas', qasRouter);

// 에러 핸들링 미들웨어 -> 앱 전체적으로 검사하므로 맨 마지막에 배치해야함
app.use(errorHandler);

const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => {
    console.log(`Server Listening on Port ${SERVER_PORT}`);
});
