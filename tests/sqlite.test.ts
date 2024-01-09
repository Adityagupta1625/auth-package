import { insertOTP, verifyOTP } from '../src/sqlite/src/sqlite';

const data = { email: 'test@gmail.com', otp: '123456' };

describe('insertOTP', () => {
  test('should insert OTP into Sqlite', async () => {
    // Act
    await insertOTP(data);

   
  });
});

describe('verifyOTP', () => {
  test('should verify valid OTP and delete from Sqlite', async () => {
    // Act
    const result = await verifyOTP(data);

    // Assert
    expect(result).toBe(true);
  });

  test('should return false if OTP is invalid', async () => {
    // Act
    const result = await verifyOTP({ email: data.email, otp: '123789' });

    // Assert
    expect(result).toBe(false);
  });
});
