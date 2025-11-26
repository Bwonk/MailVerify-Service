const { ValidationError, AppError } = require('../utils/errors');
const { errorResponse } = require('../utils/response');

/**
 * Global error handling middleware
 * Catches all errors and formats them into consistent JSON responses
 * 
 * @param {Error} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
function errorHandler(err, req, res, next) {
  // Handle ValidationError (Zod validation failures)
  if (err instanceof ValidationError) {
    return res.status(400).json(errorResponse(err.message));
  }

  // Handle AppError (known application errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message));
  }

  // Handle unknown errors
  // Log full error details for debugging
  console.error('Unexpected error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Return generic error message to client
  return res.status(500).json(errorResponse('Internal server error'));
}

module.exports = errorHandler;
