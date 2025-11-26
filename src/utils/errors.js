/**
 * Custom error class for validation errors
 * Used when input validation fails (Zod schema validation)
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Custom error class for application errors
 * Used for known business logic errors with specific status codes
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

module.exports = {
  ValidationError,
  AppError
};
