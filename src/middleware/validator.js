const { ValidationError } = require('../utils/errors');

/**
 * @param {import('zod').ZodSchema} schema - Doğrulama için kullanılacak Zod şeması
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const message = error.errors.map(err => err.message).join(', ');
        throw new ValidationError(message);
      }
      throw new ValidationError('Validation failed');
    }
  };
};

module.exports = { validate };
