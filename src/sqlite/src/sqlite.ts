import sqlite3 from "sqlite3";
import { dbTypes } from "@email-otp-auth/utils/types";

/**
 * Creates the "users" table in the SQLite database if it doesn't exist.
 *
 * @returns {Promise<void>} - A Promise that resolves when the table creation is completed.
 */
const createTableQuery = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db = await getDBConnection();

    db.run(
      "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT UNIQUE, otp TEXT)",
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
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
  return new Promise(async (resolve, reject) => {
    const db = await getDBConnection();

    db.get(
      "SELECT email,otp FROM users WHERE email=?",
      [data.email],
      (err, row) => {
        if (err) {
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
const insertQuery = (data: dbTypes.dbData): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db = await getDBConnection();

    db.run(
      "INSERT INTO users(email,otp) VALUES(?,?) ON CONFLICT(email) DO UPDATE SET otp=excluded.otp",
      [data.email, data.otp],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );

    db.close();
  });
};

/**
 * Establishes a connection to the SQLite database.
 *
 * @returns {Promise<sqlite3.Database>} - A Promise that resolves to the SQLite database connection.
 * @throws {Error} - Throws an error if there is an issue creating the database connection.
 */
const getDBConnection = async (): Promise<sqlite3.Database> => {
  try {
    const db = new sqlite3.Database("./users.db");
    return db;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Deletes a user record from the "users" table based on the provided email.
 *
 * @param {string} email - The email address of the user whose record needs to be deleted.
 * @returns {Promise<void>} - A Promise that resolves when the deletion is completed.
 */
const deleteQuery = async (email: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db = await getDBConnection();

    db.run("DELETE FROM users WHERE email=?", [email], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

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

    if (results && results.otp === data.otp) {
      await deleteQuery(data.email);
      return true;
    } else return false;
  } catch (e) {
    throw new Error(e);
  }
};
