import { MailServerConfiguration } from './mailServerConfig';
/**
 * Sends an email containing a One-Time Password (OTP) to the specified recipient.
 *
 * @param {MailServerConfiguration} mailServerConfig - The configuration for the mail server.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The One-Time Password (OTP) to be included in the email.
 * @returns {Promise<void>} - A Promise that resolves when the email is successfully sent.
 * @throws {Error} - Throws an error if there is an issue with sending the email.
 */
export declare const sendMail: (mailServerConfig: MailServerConfiguration, to: string, otp: string) => Promise<void>;
//# sourceMappingURL=mailer.d.ts.map