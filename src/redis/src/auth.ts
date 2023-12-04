import otpGenerator from 'otp-generator';
import { mailer } from '@email-otp-auth/utils';
import { type mailTypes } from '@email-otp-auth/utils/types'
import { insertOTP, verifyOTP } from './redis';

/**
 * Auth class for handling OTP generation and verification.
 *
 * @class Auth
 */
export class Auth {
  /**
   * The configuration for the mail server.
   *
   * @type {mailTypes.MailServerConfiguration}
   * @private
   */
  private readonly mailServerConfig: mailTypes.MailServerConfiguration;

  /**
   * The Redis URL for connecting to the Redis database.
   *
   * @type {string}
   * @private
   */
  private readonly redisURL: string = '';

  /**
   * Creates an instance of Auth.
   *
   * @param {string} redisURL - The Redis URL for connecting to the Redis database.
   * @param {mailTypes.MailServerConfiguration} mailServerConfig - The configuration for the mail server.
   * @memberof Auth
   * @constructor
   */
  constructor(redisURL: string, mailServerConfig: mailTypes.MailServerConfiguration) {
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
        lowerCaseAlphabets: false,
      });

      // Send OTP via email
      await mailer.sendMail(this.mailServerConfig, email, otp);

      // Insert OTP in Redis
      await insertOTP({ email, otp }, this.redisURL);
    } catch (e: any) {
      // Throw an error if there is an issue generating or sending OTP.
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
      // Verify OTP in Redis
      const response: boolean = await verifyOTP({ email, otp }, this.redisURL);
      return response;
    } catch (e: any) {
      // Throw an error if there is an issue verifying OTP.
      throw new Error(e);
    }
  }
}
