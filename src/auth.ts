import otpGenerator from 'otp-generator'
import { redisClient } from "./redis";
import { sendMail } from "./mailer";

export class Auth {
  private host: string = "";
  private port: number = 0;
  private email: string = "";
  private pass: string = "";
  private name: string = "";
  private subject: string = "";
  private body: string = "";
  private connectionString = "";

  constructor(
    host: string,
    port: number,
    email: string,
    pass: string,
    name: string,
    subject: string,
    body: string,
    connectionString: string
  ) {
    this.host = host;
    this.port = port;
    this.email = email;
    this.pass = pass;
    this.name = name;
    this.subject = subject;
    this.body = body;
    this.connectionString = connectionString;
  }


  public async generateOTP(email: string): Promise<void> {
    try {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      this.body = this.body.replace("{{otp}}", otp);

      await sendMail(
        this.host,
        this.port,
        this.email,
        this.pass,
        this.name,
        email,
        this.subject,
        this.body
      );

      const dbClient = await redisClient(this.connectionString);

      if (await dbClient.get(email)) {
        dbClient.del(email);
      }

      dbClient.set(email, otp);
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      const dbClient = await redisClient(this.connectionString);

      const storedOTP = await dbClient.get(email);

      if (storedOTP === otp) {
        dbClient.del(email);
        return true;
      } 
      else {
        return false;
      }
    } 
    catch (e: any) {
      throw new Error(e);
    }
  }
}
