/**
 * Configuration interface for mail server settings.
 *
 * @interface MailServerConfiguration
 */export interface MailServerConfiguration {
  /**
     * The host name of the mail server.
     *
     * @type {string}
     */
  host: string

  /**
     * The port number for connecting to the mail server.
     *
     * @type {number}
     */
  port: number

  /**
     * The email address used for authentication.
     *
     * @type {string}
     */
  email: string

  /**
     * The app password associated with the email address for authentication. You can refer google for app password.

     *
     * @type {string}
     */
  pass: string

  /**
     * The name associated with the sender of the email.
     *
     * @type {string}
     */
  name: string

  /**
     * The subject of the email.
     *
     * @type {string}
     */
  subject: string

  /**
     * The body or content of the email with template {{otp}} for otp replacement.
     *
     * @type {string}
     */
  body: string
}
