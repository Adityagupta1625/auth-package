import nodemailer from 'nodemailer'
import { type mailTypes } from '../types'

/**
 * Sends an email containing a One-Time Password (OTP) to the specified recipient.
 *
 * @param {mailTypes.MailServerConfiguration} mailServerConfig - The configuration for the mail server.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The One-Time Password (OTP) to be included in the email.
 * @returns {Promise<void>} - A Promise that resolves when the email is successfully sent.
 * @throws {Error} - Throws an error if there is an issue with sending the email.
 */
export const sendMail = async (
  mailServerConfig: mailTypes.MailServerConfiguration,
  to: string,
  otp: string
): Promise<void> => {
  try {
    // Create a nodemailer transporter using the provided mail server configuration.
    const transporter: any = nodemailer.createTransport({
      host: mailServerConfig.host,
      port: mailServerConfig.port,
      secure: false,
      auth: {
        user: mailServerConfig.email,
        pass: mailServerConfig.pass
      }
    })

    // Configure email options including sender, recipient, subject, and HTML content.
    const mailOptions = {
      from: `'${mailServerConfig.name}' <${mailServerConfig.email}>`,
      to,
      subject: mailServerConfig.subject,
      html: `${mailServerConfig.body.replace('{{otp}}', otp)}`
    }

    // Send the email using the configured transporter and mail options.
    await transporter.sendMail(mailOptions)

    console.log('Email sent successfully') // Log a message indicating that the email was sent successfully.
  } catch (e: any) {
    // Throw an error if there is an issue with sending the email.
    console.error(e)
    throw new Error(e)
  }
}
