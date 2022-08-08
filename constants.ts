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
