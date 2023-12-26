import { sendMail } from '../src/utils/src/mailer' // Adjust the path accordingly
import nodemailer,{Transporter} from 'nodemailer'
import { mocked } from 'jest-mock'

jest.mock('nodemailer');
const mockedCreateTransport = mocked(nodemailer.createTransport);
const mockedSendMail = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockedCreateTransport.mockImplementation(() => ({
    sendMail: mockedSendMail,
  }) as unknown as Transporter);
});

describe('sendMail', () => {
  test('should send an email successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log')

    // Arrange
    const mailServerConfig = {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      email: 'sender@example.com',
      pass: 'password',
      name: 'Sender Name',
      subject: 'Test Subject',
      body: 'Your OTP is {{otp}}',
    };

    const to = 'recipient@example.com';
    const otp = '123456';

    // Act
    await sendMail(mailServerConfig, to, otp);

    // Assert
    expect(mockedCreateTransport).toHaveBeenCalledWith({
      host: mailServerConfig.host,
      port: mailServerConfig.port,
      secure: false,
      auth: {
        user: mailServerConfig.email,
        pass: mailServerConfig.pass,
      },
    });

    expect(mockedSendMail).toHaveBeenCalledWith({
      from: `'${mailServerConfig.name}' <${mailServerConfig.email}>`,
      to,
      subject: mailServerConfig.subject,
      html: `${mailServerConfig.body.replace('{{otp}}', otp)}`,
    });

    // Ensure the success message is logged
    expect(consoleSpy).toHaveBeenCalledWith('Email sent successfully')
    consoleSpy.mockRestore()
  });

  test('should throw an error if sending email fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error')
    // Arrange
    const mailServerConfig = {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      email: 'sender@example.com',
      pass: 'password',
      name: 'Sender Name',
      subject: 'Test Subject',
      body: 'Your OTP is {{otp}}',
    };

    const to = 'recipient@example.com';
    const otp = '123456';

    // Mock nodemailer to throw an error when sendMail is called
    mockedSendMail.mockRejectedValueOnce(new Error('Sending email failed'));

    // Act and Assert
    await expect(sendMail(mailServerConfig, to, otp)).rejects.toThrow('Sending email failed');

    // Ensure the error is logged
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
    consoleSpy.mockRestore()
  });
});
