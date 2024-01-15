import sqlite3 from 'sqlite3';

/**
 * Type definition for representing user data in the context of OTP (One-Time Password) operations.
 *
 * @typedef {Object} dbData
 * @property {string} email - The email address of the user.
 * @property {string} otp - The One-Time Password (OTP) associated with the user.
 */
interface dbData {
  email: string;
  otp: string;
}

/**
 * Establishes a connection to the SQLite database.
 *
 * @returns {Promise<sqlite3.Database>} - A Promise that resolves to the SQLite database connection.
 * @throws {Error} - Throws an error if there is an issue creating the database connection.
 */
export const getDBConnection = async (): Promise<sqlite3.Database> => {
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
export const createTableQuery = async (): Promise<string> => {
  const db = await getDBConnection();

  return await new Promise((resolve, reject) => {
    db.run(
      'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT UNIQUE, otp TEXT,created_at DATETIME)',
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
 * @param {dbData} data - The data object containing the email for fetching user information.
 * @returns {Promise<dbData>} - A Promise that resolves to the user information (email and OTP).
 */
export const fetchQuery = async (
  data: dbData
): Promise<{
  email: string;
  otp: string;
  created_at: number;
}> => {
  const db = await getDBConnection();

  return await new Promise((resolve, reject) => {
    db.get(
      'SELECT email,otp,created_at FROM users WHERE email=?',
      [data.email],
      (err, row) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(row as any);
        }
      }
    );

    db.close();
  });
};

/**
 * Inserts or updates the OTP for a user in the "users" table.
 *
 * @param {dbData} data - The data object containing the user's email and OTP.
 * @returns {Promise<void>} - A Promise that resolves when the insertion or update is completed.
 */
export const insertQuery = async (data: dbData): Promise<string> => {
  const db = await getDBConnection();

  return await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users(email,otp,created_at) VALUES(?,?,?) ON CONFLICT(email) DO UPDATE SET otp=excluded.otp,created_at=excluded.created_at',
      [data.email, data.otp, new Date()],
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
 * @param {dbData} data - The data object containing the user's email and OTP.
 * @returns {Promise<void>} - A Promise that resolves when the OTP insertion is completed.
 * @throws {Error} - Throws an error if there is an issue with the OTP insertion.
 */
export const insertOTP = async (data: dbData): Promise<void> => {
  try {
    const db = await getDBConnection();

    await createTableQuery();

    await insertQuery(data);

    db.close();
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Verifies the provided OTP for a user by checking it against the stored OTP in the "users" table.
 * If the OTP is valid, the user record is deleted.
 *
 * @param {dbData} data - The data object containing the user's email and OTP for verification.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the OTP is valid, false otherwise.
 * @throws {Error} - Throws an error if there is an issue with OTP verification.
 */
export const verifyOTP = async (data: dbData): Promise<boolean> => {
  try {
    const results = await fetchQuery(data);
    const present = new Date();

    if (results === null) throw new Error('Invalid Request');

    if (present.getTime() - results.created_at > 300000)
      throw new Error('Otp expired');

    if (results.otp === data.otp) {
      return true;
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (e) {
    throw new Error(e);
  }
};
