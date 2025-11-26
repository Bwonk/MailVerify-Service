const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

/**
 * Register controller - handles user registration
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.register(email, password);
    res.status(200).json(successResponse(result.message));
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email controller - handles email verification
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    res.status(200).json(successResponse(result.message));
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification controller - handles resending verification email
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    res.status(200).json(successResponse(result.message));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification
};
