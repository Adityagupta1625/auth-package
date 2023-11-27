
# otp-auth

This repository contains the source code for an OTP (One-Time Password) authentication service. The service utilizes Redis for storing and verifying OTPs and a node mail server for sending OTPs via email.
`

## Configuration

### Mail Server Configuration

Make sure to configure the mail server settings by providing the necessary information in the \`MailServerConfiguration\` interface. The interface is defined as follows:

\`\`\`typescript
interface MailServerConfiguration {
  host: string;
  port: number;
  email: string;
  pass: string;
  name: string;
  subject: string;
  body: string;
}
\`\`\`

### Redis Configuration

Update the Redis URL in the \`Auth\` class constructor:

\`\`\`typescript
const auth = new Auth('YOUR_REDIS_URL', mailServerConfig);
\`\`\`

## Usage

### Generate OTP

To generate and send an OTP to a specified email address, use the following code snippet:

\`\`\`typescript
const email = 'user@example.com';

try {
  await auth.generateOTP(email);
  console.log(\`OTP sent successfully to \${email}\`);
} catch (error) {
  console.error(\`Error sending OTP: \${error.message}\`);
}
\`\`\`

### Verify OTP

To verify an OTP for a specified email address, use the following code snippet:

\`\`\`typescript
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
  console.error(\`Error verifying OTP: \${error.message}\`);
}
\`\`\`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
