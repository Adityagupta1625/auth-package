import nodemailer from "nodemailer";

export const sendMail = async (
  host: string,
  port: number,
  user: string,
  pass: string,
  from: string,
  to: string,
  subject: string,
  text: string
):Promise<void> => {
  try {
    const transporter: any = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `"${from}" <${user}>`,
      to: to,
      subject: subject,
      html: `${text}`,
    };

    await transporter.sendMail(mailOptions);
  } 
  
  catch (e: any) {
    throw new Error(e);
  }
};
