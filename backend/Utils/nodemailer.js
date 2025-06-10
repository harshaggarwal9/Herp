import dotenv from "dotenv";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVICE,       
  port: 465,                    
  secure: true,                 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_USER_PASS
  }
});

export const sendTemplateMail = async ({ to, subject,  templateData }) => {
   const templatePath = path.join(__dirname,"mail.ejs");
  const html = await ejs.renderFile(templatePath, templateData);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
};
