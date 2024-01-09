import { insertOTP, verifyOTP } from '../src/redis/src/redis';

const data = { email: 'test@gmail.com', otp: '123456' };

const connectionString =
  'rediss://red-clmlgokjtl8s73a5t110:SWtnFi6BIMjvBw6Ca4SGFOwKF4ieHcKE@oregon-redis.render.com:6379';

describe('insertOTP', () => {
  test('should insert OTP into Redis', async () => {

    // Act
    await insertOTP(data, connectionString);

  });
});

describe('verifyOTP', () => {
  test('should verify valid OTP and delete from Redis', async () => {
    // Act
    const result = await verifyOTP(data, connectionString);

    // Assert
    expect(result).toBe(true);
  });

  test('should return false if OTP is invalid', async () => {
    // Act
    const result = await verifyOTP(
      { email: data.email, otp: '123789' },
      connectionString
    );

    // Assert
    expect(result).toBe(false);
  });
});
