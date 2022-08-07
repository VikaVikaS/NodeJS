import path from 'path';

export const DB_PATH_USERS = path.join(__dirname, 'users.db');
export const DB_PATH_EXERCISES = path.join(__dirname, 'exercises.db');

export const ERRORS_LIST = {
  NOT_FOUND: {
    statusCode: 404,
    message: 'User not found',
  },
  INVALID_REQUEST: {
    statusCode: 400,
    message: 'Invalid request',
  },
  ALREADY_EXISTS: {
    statusCode: 400,
    message: 'Username already exists',
  },
  INTERNAL_ERROR: {
    message: 'Something went wrong. Please, try again later',
    statusCode: 500,
  },
  MISSED_FIELD: (field: string) => ({
    message: `${field} is required`,
    statusCode: 400,
  }),
};
