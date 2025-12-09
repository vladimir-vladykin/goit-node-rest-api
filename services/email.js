import nodemailer from "nodemailer";
import "dotenv/config";

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export function sendMail(subject, text, to) {
  const emailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  transporter
    .sendMail(emailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
}
