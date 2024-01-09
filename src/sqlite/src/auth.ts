import otpGenerator from 'otp-generator';
import { mailer } from '../../utils/src';
import { insertOTP, verifyOTP } from './sqlite';
import { MailServerConfiguration } from '../../utils/src/mailServerConfig';
/**
 * Auth class for handling OTP generation and verification using SQLite for OTP storage.
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
  private readonly mailServerConfig: MailServerConfiguration;

  /**
   * Creates an instance of Auth.
   *
   * @param {MailServerConfiguration} mailServerConfig - The configuration for the mail server.
   * @memberof Auth
   * @constructor
   */
  constructor(mailServerConfig: MailServerConfiguration) {
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

      // Insert OTP in SQLite database
      await insertOTP({ email, otp });
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
      // Verify OTP in SQLite database
      if(email===null || otp===null) throw new Error('invalid arguments')
      
      const response: boolean = await verifyOTP({ email, otp });
      return response;
    } catch (e: any) {
      // Throw an error if there is an issue verifying OTP.
      throw new Error(e);
    }
  }
}
