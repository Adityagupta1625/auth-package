import otpGenerator from 'otp-generator';
import { redisClient } from './redis';
import { sendMail } from './mailer';
import { MailServerConfiguration } from './type';

/**
 * Auth class for handling OTP generation and verification.
 *
 * @class Auth
 */
export class Auth {
  /**
   * The configuration for the mail server.
   *
   * @type {MailServerConfiguration}
   * @private
   */
  private mailServerConfig: MailServerConfiguration;

  /**
   * The Redis URL for connecting to the Redis database.
   *
   * @type {string}
   * @private
   */
  private redisURL: string = "";

  /**
   * Creates an instance of Auth.
   *
   * @param {string} redisURL - The Redis URL for connecting to the Redis database.
   * @param {MailServerConfiguration} mailServerConfig - The configuration for the mail server.
   * @memberof Auth
   * @constructor
   */
  constructor(redisURL: string, mailServerConfig: MailServerConfiguration) {
    this.redisURL = redisURL;
    this.mailServerConfig = mailServerConfig;
  }

  /**
   * Generates and sends an OTP to the specified email address.
   *
   * @param {string} email - The email address to which the OTP will be sent.
   * @returns {Promise<void>} - A Promise that resolves when the OTP is generated and sent.
   * @memberof Auth
   * @public
   */
  public async generateOTP(email: string): Promise<void> {
    try {
      // Generate OTP
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      // Send OTP via email
      sendMail(this.mailServerConfig, email, otp);

      // Connect to Redis database
      const dbClient = await redisClient(this.redisURL);

      // Remove existing OTP if any
      if (await dbClient.get(email)) {
        dbClient.del(email);
      }

      // Store new OTP in Redis
      dbClient.set(email, otp);
    } catch (e: any) {
      throw new Error(e);
    }
  }

  /**
   * Verifies the provided OTP for the specified email address.
   *
   * @param {string} email - The email address for which OTP verification is requested.
   * @param {string} otp - The OTP to be verified.
   * @returns {Promise<boolean>} - A Promise that resolves to true if the OTP is valid, false otherwise.
   * @memberof Auth
   * @public
   */
  public async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      // Connect to Redis database
      const dbClient = await redisClient(this.redisURL);

      // Retrieve stored OTP from Redis
      const storedOTP = await dbClient.get(email);

      // Compare provided OTP with stored OTP
      if (storedOTP === otp) {
        // Delete OTP from Redis if it matches
        dbClient.del(email);
        return true;
      } else {
        return false;
      }
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
