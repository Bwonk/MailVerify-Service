const { ValidationError } = require('../utils/errors');

/**
 * Middleware factory that validates request body against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
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
