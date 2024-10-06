import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "muthumuthu7699@gmail.com", //Gmail from which we got a password
    pass: process.env.MAIL_KEY,
  },
});

//sample mail sending details
export const mailOptions = {
  from: "muthumuthu7699@gmail.com",
  to: ["muthukumaran05019@gmail.com"],
  subject: "Testing mail",
  text: "Sending mail for testing purpose",
};
