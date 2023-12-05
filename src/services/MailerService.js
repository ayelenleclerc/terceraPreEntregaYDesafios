import nodemailer from "nodemailer";
import config from "../config/config.js";

export default class MailerService {
  constructor() {
    this.client = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: config.mailer.USER,
        pass: config.mailer.PASS,
      },
    });
  }

  sendMail = async (payload) => {
    const result = await this.client.sendMail(payload);
    return result;
  };
}
