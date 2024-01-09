"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Sends an email containing a One-Time Password (OTP) to the specified recipient.
 *
 * @param {MailServerConfiguration} mailServerConfig - The configuration for the mail server.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The One-Time Password (OTP) to be included in the email.
 * @returns {Promise<void>} - A Promise that resolves when the email is successfully sent.
 * @throws {Error} - Throws an error if there is an issue with sending the email.
 */
const sendMail = (mailServerConfig, to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a nodemailer transporter using the provided mail server configuration.
        const transporter = nodemailer_1.default.createTransport({
            host: mailServerConfig.host,
            port: mailServerConfig.port,
            secure: false,
            auth: {
                user: mailServerConfig.email,
                pass: mailServerConfig.pass,
            },
        });
        // Configure email options including sender, recipient, subject, and HTML content.
        const mailOptions = {
            from: `'${mailServerConfig.name}' <${mailServerConfig.email}>`,
            to,
            subject: mailServerConfig.subject,
            html: `${mailServerConfig.body.replace('{{otp}}', otp)}`,
        };
        // Send the email using the configured transporter and mail options.
        yield transporter.sendMail(mailOptions);
    }
    catch (e) {
        // Throw an error if there is an issue with sending the email.
        console.error(e);
        throw new Error(e);
    }
});
exports.sendMail = sendMail;
//# sourceMappingURL=mailer.js.map