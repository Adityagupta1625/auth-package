import { insertOTP,verifyOTP,getDBConnection,insertQuery,fetchQuery,createTableQuery} from '../src/sqlite/src/sqlite';
import sqlite3 from 'sqlite3'

// Mocking the database connection
jest.mock('sqlite3');

describe('Database Operations', () => {
  // Mocking the database run method
  const runMock = jest.fn();
  const mockSqlite=jest.spyOn(sqlite3,'Database')

  // Setting up a mock SQLite database
  beforeEach(() => {
    mockSqlite.mockImplementation(() => ({
      run: runMock,
      close: jest.fn(),
      get: jest.fn(),
    }) as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTableQuery', () => {
    it('should create the "users" table', async () => {
      runMock.mockImplementationOnce((query, callback) => {
        callback(null); // Simulate successful table creation
      });

      await createTableQuery();

      expect(runMock).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT UNIQUE, otp TEXT,created_at DATETIME)',
        expect.any(Function)
      );
    });

    it('should throw an error if there is an issue with table creation', async () => {
      runMock.mockImplementationOnce((query, callback) => {
        callback(new Error('Table creation error')); // Simulate table creation error
      });

      await expect(createTableQuery()).rejects.toThrow('Table creation error');
    });
  });

  describe('insertQuery', () => {
    it('should insert or update the OTP for a user', async () => {
      runMock.mockImplementationOnce((query, params, callback) => {
        callback(null); // Simulate successful insertion/update
      });

      await insertQuery({ email: 'test@example.com', otp: '123456' });

      expect(runMock).toHaveBeenCalledWith(
        'INSERT INTO users(email,otp,created_at) VALUES(?,?,?) ON CONFLICT(email) DO UPDATE SET otp=excluded.otp,created_at=excluded.created_at',
        ['test@example.com', '123456', expect.any(Date)],
        expect.any(Function)
      );
    });

    it('should throw an error if there is an issue with OTP insertion', async () => {
      runMock.mockImplementationOnce((query, params, callback) => {
        callback(new Error('OTP insertion error')); // Simulate OTP insertion error
      });

      await expect(insertQuery({ email: 'test@example.com', otp: '123456' })).rejects.toThrow(
        'OTP insertion error'
      );
    });
  });

  describe('insertOTP', () => {
    it('should create the table and insert OTP for a user', async () => {
      runMock.mockImplementationOnce((query, callback) => {
        callback(null); // Simulate successful table creation
      });

      runMock.mockImplementationOnce((query, params, callback) => {
        callback(null); // Simulate successful OTP insertion
      });

      await insertOTP({ email: 'test@example.com', otp: '123456' });

      expect(runMock).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT UNIQUE, otp TEXT,created_at DATETIME)',
        expect.any(Function)
      );

      expect(runMock).toHaveBeenCalledWith(
        'INSERT INTO users(email,otp,created_at) VALUES(?,?,?) ON CONFLICT(email) DO UPDATE SET otp=excluded.otp,created_at=excluded.created_at',
        ['test@example.com', '123456', expect.any(Date)],
        expect.any(Function)
      );
    });

    it('should throw an error if there is an issue with OTP insertion', async () => {
      runMock.mockImplementationOnce((query, callback) => {
        callback(new Error('Table creation error')); // Simulate table creation error
      });

      await expect(insertOTP({ email: 'test@example.com', otp: '123456' })).rejects.toThrow(
        'Table creation error'
      );
    });
  });

  // some cases are not correct

  // describe('fetchQuery', () => {
  //   it('should fetch user information from the "users" table', async () => {
  //     const mockUserData = { email: 'test@example.com', otp: '123456', created_at: Date.now() };

  //     runMock.mockImplementationOnce((query, params, callback) => {
  //       callback(null, mockUserData); // Simulate successful fetch
  //     });

  //     const userData = await fetchQuery({ email: 'test@example.com', otp: '123456' });

  //     expect(runMock).toHaveBeenCalledWith(
  //       'SELECT email,otp,created_at FROM users WHERE email=?',
  //       ['test@example.com'],
  //       expect.any(Function)
  //     );

  //     expect(userData).toEqual(mockUserData);
  //   });

  //   it('should return null for a non-existing user', async () => {
  //     runMock.mockImplementationOnce((query, params, callback) => {
  //       callback(null, null); // Simulate no results
  //     });

  //     const userData = await fetchQuery({ email: 'nonexistent@example.com', otp: '123456' });

  //     expect(runMock).toHaveBeenCalledWith(
  //       'SELECT email,otp,created_at FROM users WHERE email=?',
  //       ['nonexistent@example.com'],
  //       expect.any(Function)
  //     );

  //     expect(userData).toBeNull();
  //   });

  //   it('should throw an error if there is an issue with database fetch', async () => {
  //     runMock.mockImplementationOnce((query, params, callback) => {
  //       callback(new Error('Database error')); // Simulate database error
  //     });

  //     await expect(fetchQuery({ email: 'test@example.com', otp: '123456' })).rejects.toThrow(
  //       'Database error'
  //     );
  //   });
  // });

  // describe('verifyOTP', () => {
  //   it('should verify a valid OTP', async () => {
  //     const mockUserData = { email: 'test@example.com', otp: '123456', created_at: Date.now() };

  //     runMock.mockReturnValue(mockUserData)

  //     const isValid = await verifyOTP({ email: 'test@example.com', otp: '123456' });

  //     expect(isValid).toBe(true);
  //   });

  //   it('should throw an error for an invalid OTP', async () => {
  //     const mockUserData = { email: 'test@example.com', otp: '654321', created_at: Date.now() };

  //     runMock.mockImplementationOnce((query, params, callback) => {
  //       callback(null, mockUserData); // Simulate successful fetch
  //     });

  //     await expect(verifyOTP({ email: 'test@example.com', otp: '123456' })).rejects.toThrow(
  //       'Invalid OTP'
  //     );
  //   });

  //   it('should throw an error for an expired OTP', async () => {
  //     const mockUserData = {
  //       email: 'test@example.com',
  //       otp: '123456',
  //       created_at: Date.now() - 310000,
  //     };

  //     runMock.mockImplementationOnce((query, params, callback) => {
  //       callback(null, mockUserData); // Simulate successful fetch
  //     });

  //     await expect(verifyOTP({ email: 'test@example.com', otp: '123456' })).rejects.toThrow(
  //       'Otp expired'
  //     );
  //   });

  //   it('should throw an error for an invalid request', async () => {
  //     runMock.mockImplementationOnce((query, params, callback) => {
  //       callback(null, null); // Simulate no results (invalid request)
  //     });

  //     await expect(verifyOTP({ email: 'test@example.com', otp: '123456' })).rejects.toThrow(
  //       'Invalid Request'
  //     );
  //   });

  //   it('should throw an error if there is an issue with database fetch', async () => {
  //     runMock.mockImplementationOnce((query, params, callback) => {
  //       callback(new Error('Database error')); // Simulate database error
  //     });

  //     await expect(verifyOTP({ email: 'test@example.com', otp: '123456' })).rejects.toThrow(
  //       'Database error'
  //     );
  //   });
  // });
});



