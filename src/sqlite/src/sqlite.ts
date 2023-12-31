import sqlite3 from 'sqlite3';
import { type dbTypes } from '@email-otp-auth/utils/types';

/**
 * Establishes a connection to the SQLite database.
 *
 * @returns {Promise<sqlite3.Database>} - A Promise that resolves to the SQLite database connection.
 * @throws {Error} - Throws an error if there is an issue creating the database connection.
 */
const getDBConnection = async (): Promise<sqlite3.Database> => {
  try {
    const db = new sqlite3.Database('./users.db');
    return db;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Creates the "users" table in the SQLite database if it doesn't exist.
 *
 * @returns {Promise<void>} - A Promise that resolves when the table creation is completed.
 */
const createTableQuery = async (): Promise<string> => {
  const db = await getDBConnection();

  return await new Promise((resolve, reject) => {
    db.run(
      'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT UNIQUE, otp TEXT)',
      (err) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve('done');
        }
      }
    );

    db.close();
  });
};

/**
 * Fetches user information (email and OTP) from the "users" table based on the provided email.
 *
 * @param {dbTypes.dbData} data - The data object containing the email for fetching user information.
 * @returns {Promise<dbTypes.dbData>} - A Promise that resolves to the user information (email and OTP).
 */
const fetchQuery = async (data: dbTypes.dbData): Promise<dbTypes.dbData> => {
  const db = await getDBConnection();

  return await new Promise((resolve, reject) => {
    db.get(
      'SELECT email,otp FROM users WHERE email=?',
      [data.email],
      (err, row) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(row as dbTypes.dbData);
        }
      }
    );

    db.close();
  });
};

/**
 * Inserts or updates the OTP for a user in the "users" table.
 *
 * @param {dbTypes.dbData} data - The data object containing the user's email and OTP.
 * @returns {Promise<void>} - A Promise that resolves when the insertion or update is completed.
 */
const insertQuery = async (data: dbTypes.dbData): Promise<string> => {
  const db = await getDBConnection();

  return await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users(email,otp) VALUES(?,?) ON CONFLICT(email) DO UPDATE SET otp=excluded.otp',
      [data.email, data.otp],
      (err) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve('done');
        }
      }
    );

    db.close();
  });
};

/**
 * Inserts the OTP for a user into the "users" table, creating the table if necessary.
 *
 * @param {dbTypes.dbData} data - The data object containing the user's email and OTP.
 * @returns {Promise<void>} - A Promise that resolves when the OTP insertion is completed.
 * @throws {Error} - Throws an error if there is an issue with the OTP insertion.
 */
export const insertOTP = async (data: dbTypes.dbData): Promise<void> => {
  try {
    const db = await getDBConnection();

    await createTableQuery();

    await insertQuery(data);

    db.close();

    console.log('OTP inserted into Sqlite successfully.');
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Verifies the provided OTP for a user by checking it against the stored OTP in the "users" table.
 * If the OTP is valid, the user record is deleted.
 *
 * @param {dbTypes.dbData} data - The data object containing the user's email and OTP for verification.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the OTP is valid, false otherwise.
 * @throws {Error} - Throws an error if there is an issue with OTP verification.
 */
export const verifyOTP = async (data: dbTypes.dbData): Promise<boolean> => {
  try {
    const results = await fetchQuery(data);
    console.log('results-->', results);

    if (results.otp === data.otp) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw new Error(e);
  }
};
