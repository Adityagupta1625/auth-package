/**
 * Type definition for representing user data in the context of OTP (One-Time Password) operations.
 *
 * @typedef {Object} dbData
 * @property {string} email - The email address of the user.
 * @property {string} otp - The One-Time Password (OTP) associated with the user.
 */
export interface dbData {
  email: string
  otp: string
}
