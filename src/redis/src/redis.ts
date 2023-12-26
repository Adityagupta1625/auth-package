import { createClient } from 'redis';
import { type dbTypes } from '@email-otp-auth/utils/types';

/**
 * Asynchronous function to create a Redis client and connect to a Redis server using the provided connection string.
 *
 * @param {string} connectionString - The Redis server connection string.
 * @returns {Promise<any>} A Promise that resolves to the Redis client.
 * @throws {Error} Throws an error if there is an issue creating or connecting the Redis client.
 */
const redisClient = async (connectionString: string): Promise<any> => {
  try {
    // Create a Redis client with the specified connection URL.
    const client = createClient({
      url: connectionString,
    });

    client.on('error', (err) => {
      throw new Error(err);
    });

    // Connect to the Redis server.
    await client.connect();

    // Return the connected Redis client.
    return client;
  } catch (e: any) {
    // Throw an error if there is an issue creating or connecting the Redis client.
    throw new Error(e);
  }
};

/**
 * Asynchronous function to insert an OTP (One-Time Password) into Redis for a specific user's email.
 *
 * @param {dbTypes.dbData} data - The data object containing user information and OTP.
 * @param {string} connectionString - The Redis server connection string.
 * @throws {Error} Throws an error if there is an issue inserting the OTP into Redis.
 */
export const insertOTP = async (
  data: dbTypes.dbData,
  connectionString: string
): Promise<void> => {
  try {
    // Get a Redis client by connecting to the Redis server.
    const client = await redisClient(connectionString);

    // Set the OTP in Redis using the user's email as the key.
    await client.set(data.email, data.otp);
    await client.disconnect(); // Disconnect from the Redis server.

    console.log('OTP inserted into Redis successfully.');
  } catch (e: any) {
    // Throw an error if there is an issue with Redis operations.
    console.error(e);
    throw new Error(e);
  }
};

/**
 * Asynchronous function to verify an OTP (One-Time Password) for a specific user's email.
 *
 * @param {dbTypes.dbData} data - The data object containing user information and OTP for verification.
 * @param {string} connectionString - The Redis server connection string.
 * @returns {Promise<boolean>} A Promise that resolves to true if the OTP is valid, false otherwise.
 * @throws {Error} Throws an error if there is an issue verifying the OTP in Redis.
 */
export const verifyOTP = async (
  data: dbTypes.dbData,
  connectionString: string
): Promise<boolean> => {
  try {
    // Get a Redis client by connecting to the Redis server.
    const client = await redisClient(connectionString);

    // Retrieve the stored OTP from Redis using the user's email as the key.
    const storedOTP = await client.get(data.email);

    // Compare the stored OTP with the provided OTP for verification.
    if (storedOTP === data.otp) {
      // Return true if the OTP is valid.
      await client.disconnect(); // Disconnect from the Redis server.
      return true;
    } else {
      // Return false if the OTP is not valid.
      await client.disconnect();
      return false;
    }
  } catch (e: any) {
    // Throw an error if there is an issue with Redis operations.
    console.error(e);
    throw new Error(e);
  }
};
