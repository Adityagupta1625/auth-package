# Email OTP Auth/Redis

This package provies a stremaline way for authentication service using email OTP.This service utilizes Redis for storing and verifying OTPs and a mail server for sending OTPs via email.

## Configuration

### Mail Server Configuration

Make sure to configure the mail server settings by providing the necessary information in the `MailServerConfiguration` interface. The interface is defined as follows:

```typescript
interface MailServerConfiguration {
  host: string; // The host name of the mail server.
  port: number; // The port number for connecting to the mail server.
  email: string; // The email address used for authentication.
  pass: string; // The app password associated with the email address for authentication. You can refer google for app password.
  name: string; // The name associated with the sender of the email.
  subject: string; // The subject of the email.
  body: string; // The body or content of the email with template {{otp}} for otp replacement.
}
```

### Redis Configuration

Set up a Redis DB URL.

### Auth Class Configruation

```typescript
const auth = new Auth('YOUR_REDIS_URL', mailServerConfig);
```

## Usage

### Generate OTP

To generate and send an OTP to a specified email address, use the following code snippet:

```typescript
const email = 'user@example.com';

try {
  await auth.generateOTP(email);
  console.log(`OTP sent successfully to ${email}`);
} catch (error) {
  console.error(`Error sending OTP: ${error.message}`);
}
```

### Verify OTP

To verify an OTP for a specified email address, use the following code snippet:

```typescript
const email = 'user@example.com';
const userEnteredOTP = '123456'; // Replace with the actual OTP entered by the user

try {
  const isOTPValid = await auth.verifyOTP(email, userEnteredOTP);
  if (isOTPValid) {
    console.log('OTP is valid');
  } else {
    console.log('Invalid OTP');
  }
} catch (error) {
  console.error(`Error verifying OTP: ${error.message}`);
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
