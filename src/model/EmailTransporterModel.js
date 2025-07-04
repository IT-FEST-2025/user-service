import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "agmerramadhan@gmail.com",
    pass: process.env.NODEMAILER_AUTH,
  },
});

export { transporter };
