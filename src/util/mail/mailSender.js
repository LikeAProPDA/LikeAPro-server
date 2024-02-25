import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mailSender = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // 보안 연결 사용 여부 (해결되면 true)
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// mailOption
// to: string 보낼 사람
// subject: string 제목
// html: html 본문
const sendEmail = (mailOption) => {
    mailSender.sendMail({ ...mailOption, from: process.env.EMAIL_ACCOUNT }, (err, info) => {
        if (err) {
            console.error('Error Sending email', err);
        } else {
            console('Email sent:', info.response);
        }
    });
};

export { sendEmail };
