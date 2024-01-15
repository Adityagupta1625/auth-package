import { insertOTP, verifyOTP } from '../src/redis/src/redis';
import { createClient } from 'redis';

jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

describe('Redis OTP Operations', () => {
  let mockCreateClient: jest.Mock;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      on: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
      disconnect: jest.fn(),
      connect: jest.fn(),
    };

    mockCreateClient = jest.mocked(createClient).mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('insertOTP should set OTP in Redis and disconnect', async () => {
    const data = {
      email: 'test@example.com',
      otp: '123456',
    };
    const connectionString = 'redis://localhost:6379';

    await insertOTP(data, connectionString);

    expect(createClient).toHaveBeenCalledWith({ url: connectionString });
    expect(mockClient.set).toHaveBeenCalledWith(data.email, expect.any(String));
    expect(mockClient.disconnect).toHaveBeenCalled();
  });

  test('verifyOTP should return true for valid OTP and disconnect', async () => {
    const data = {
      email: 'test@example.com',
      otp: '123456',
    };
    const connectionString = 'redis://localhost:6379';

    mockClient.get.mockResolvedValueOnce(
      JSON.stringify({ otp: data.otp, created_at: new Date() })
    );

    const result = await verifyOTP(data, connectionString);

    expect(createClient).toHaveBeenCalledWith({ url: connectionString });
    expect(mockClient.get).toHaveBeenCalledWith(data.email);
    expect(mockClient.disconnect).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test('verifyOTP should throw an error for expired OTP and disconnect', async () => {
    const data = {
      email: 'test@example.com',
      otp: '123456',
    };
    const connectionString = 'redis://localhost:6379';

    mockClient.get.mockResolvedValueOnce(
      JSON.stringify({ otp: data.otp, created_at: new Date('2022-01-01') })
    );

    await expect(verifyOTP(data, connectionString)).rejects.toThrowError(
      'Otp Expired'
    );

  });

  test('verifyOTP should throw an error for invalid OTP and disconnect', async () => {
    const data = {
      email: 'test@example.com',
      otp: '123456',
    };
    const connectionString = 'redis://localhost:6379';

    mockClient.get.mockResolvedValueOnce(
      JSON.stringify({ otp: '654321', created_at: new Date() })
    );

    await expect(verifyOTP(data, connectionString)).rejects.toThrowError(
      'Invalid OTP'
    );

    expect(createClient).toHaveBeenCalledWith({ url: connectionString });
    expect(mockClient.get).toHaveBeenCalledWith(data.email);
    expect(mockClient.disconnect).toHaveBeenCalled();
  });

  test('verifyOTP should throw an error for missing OTP in Redis and disconnect', async () => {
    const data = {
      email: 'test@example.com',
      otp: '123456',
    };
    const connectionString = 'redis://localhost:6379';

    mockClient.get.mockResolvedValueOnce(null);

    await expect(verifyOTP(data, connectionString)).rejects.toThrowError(
      'Invalid Request'
    );


  });

  test('insertOTP should throw an error if creating or connecting the Redis client fails', async () => {
    const data = {
      email: 'test@example.com',
      otp: '123456',
    };
    const connectionString = 'invalid-connection-string';

    mockCreateClient.mockImplementation(() => {
      throw new Error('Failed to create client');
    });

    await expect(insertOTP(data, connectionString)).rejects.toThrowError(
      'Failed to create client'
    );

    expect(createClient).toHaveBeenCalledWith({ url: connectionString });
    expect(mockClient.set).not.toHaveBeenCalled();
    expect(mockClient.disconnect).not.toHaveBeenCalled();
  });

  test('verifyOTP should throw an error if creating or connecting the Redis client fails', async () => {
    const data = {
      email: 'test@example.com',
      otp: '123456',
    };
    const connectionString = 'invalid-connection-string';

    mockCreateClient.mockImplementation(() => {
      throw new Error('Failed to create client');
    });

    await expect(verifyOTP(data, connectionString)).rejects.toThrowError(
      'Failed to create client'
    );

    expect(createClient).toHaveBeenCalledWith({ url: connectionString });
    expect(mockClient.get).not.toHaveBeenCalled();
    expect(mockClient.disconnect).not.toHaveBeenCalled();
  });
});
