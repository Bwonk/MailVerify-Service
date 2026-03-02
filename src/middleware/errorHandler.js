const { ValidationError, AppError } = require('../utils/errors');
const { errorResponse } = require('../utils/response');

/**
 * Global error handling middleware
 * Tüm hataları yakalar ve standart JSON yanıt formatına dönüştürür
 * 
 * @param {Error} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
function errorHandler(err, req, res, next) {
  // ValidationError hatalarını işler (Zod doğrulama hataları)
  if (err instanceof ValidationError) {
    return res.status(400).json(errorResponse(err.message));
  }

  // AppError hatalarını işler (bilinen uygulama hataları)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message));
  }

  // Handle unknown errors
  // Hata detaylarını debug için loglar
  console.error('Unexpected error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // İstemciye genel bir hata mesajı döndürür
  return res.status(500).json(errorResponse('Internal server error'));
}

module.exports = errorHandler;
