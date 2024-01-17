import nodemailer from "nodemailer";
import { nodeMailerConfig } from "./config";

interface MailOptions {
  from: string;
  to: string;
  subject:string;
  text: string;
  html: any;
}
export function sendMail({from, to, subject, text, html}: MailOptions) {
  var transport = nodemailer.createTransport({
    host: nodeMailerConfig.host,
    port: nodeMailerConfig.port,
    auth: {
      user: nodeMailerConfig.user,
      pass: nodeMailerConfig.pass,
    },
  });

  return new Promise((resolve, reject) => {
    transport.sendMail({from, to, subject, text, html}, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info);
    });
  });
}
