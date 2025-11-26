const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const tokenRepository = require('../repositories/token.repository');
const tokenService = require('./token.service');
const mailService = require('./mail.service');
const { AppError } = require('../utils/errors');

const SALT_ROUNDS = 10;

/**
 * Register a new user or resend verification for unverified user
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, message: string}>}
 */
const register = async (email, password) => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);
  
  if (existingUser) {
    // If user exists and is verified, return error
    if (existingUser.isVerified) {
      throw new AppError('Email already registered', 400);
    }
    
    // If user exists but is unverified, generate new token and send email
    const token = tokenService.generateToken();
    const expiresAt = tokenService.getExpirationDate();
    await tokenRepository.create(existingUser.id, token, expiresAt);
    await mailService.sendVerificationEmail(email, token);
    
    return {
      success: true,
      message: 'Verification email sent.'
    };
  }
  
  // User doesn't exist, create new user
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await userRepository.create(email, passwordHash);
  
  // Generate token and send verification email
  const token = tokenService.generateToken();
  const expiresAt = tokenService.getExpirationDate();
  await tokenRepository.create(userId, token, expiresAt);
  await mailService.sendVerificationEmail(email, token);
  
  return {
    success: true,
    message: 'Verification email sent.'
  };
};

/**
 * Verify user email with token
 * @param {string} token - Verification token
 * @returns {Promise<{success: boolean, message: string}>}
 */
const verifyEmail = async (token) => {
  // Find token in database
  const tokenData = await tokenRepository.findByToken(token);
  
  // Validate token exists
  if (!tokenData) {
    throw new AppError('Invalid or expired token', 400);
  }
  
  // Validate token is not used
  if (tokenData.used) {
    throw new AppError('Token already used', 400);
  }
  
  // Validate token is not expired
  const now = new Date();
  if (now > tokenData.expiresAt) {
    throw new AppError('Invalid or expired token', 400);
  }
  
  // Update user verification status
  await userRepository.updateVerificationStatus(tokenData.userId, true);
  
  // Mark token as used
  await tokenRepository.markAsUsed(tokenData.id);
  
  return {
    success: true,
    message: 'Email verified.'
  };
};

/**
 * Resend verification email to user
 * @param {string} email - User email address
 * @returns {Promise<{success: boolean, message: string}>}
 */
const resendVerification = async (email) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  
  // If user doesn't exist or is already verified, return success (enumeration protection)
  if (!user || user.isVerified) {
    return {
      success: true,
      message: 'Verification email sent.'
    };
  }
  
  // User exists and is unverified, generate new token and send email
  const token = tokenService.generateToken();
  const expiresAt = tokenService.getExpirationDate();
  await tokenRepository.create(user.id, token, expiresAt);
  await mailService.sendVerificationEmail(email, token);
  
  return {
    success: true,
    message: 'Verification email sent.'
  };
};

module.exports = {
  register,
  verifyEmail,
  resendVerification
};
