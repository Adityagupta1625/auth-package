import nodemailer from "nodemailer";
import { MailServerConfiguration } from "./type";

export const sendMail = async (
  mailServerConfig: MailServerConfiguration,
  to:string,
  otp: string,
):Promise<void> => {
  try {
    const transporter: any = nodemailer.createTransport({
      host: mailServerConfig.host,
      port: mailServerConfig.port,
      secure: false,
      auth: {
        user: mailServerConfig.email,
        pass: mailServerConfig.pass,
      },
    });

    const mailOptions = {
      from: `"${mailServerConfig.name}" <${mailServerConfig.email}>`,
      to: to,
      subject: mailServerConfig.subject,
      html: `${mailServerConfig.body.replace("{{otp}}",otp)}`,
    };

    await transporter.sendMail(mailOptions);
  } 
  
  catch (e: any) {
    throw new Error(e);
  }
};
