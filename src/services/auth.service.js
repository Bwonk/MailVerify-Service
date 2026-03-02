const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const tokenRepository = require('../repositories/token.repository');
const tokenService = require('./token.service');
const mailService = require('./mail.service');
const { AppError } = require('../utils/errors');

const SALT_ROUNDS = 10;

/**
 * Yeni kullanıcı kaydı oluşturur veya doğrulanmamış kullanıcıya doğrulama e-postası gönderir
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message: string}>}
 */
const register = async (email, password) => {
// Kullanıcının zaten kayıtlı olup olmadığını kontrol eder
  const existingUser = await userRepository.findByEmail(email);
  
  if (existingUser) {
    
    if (existingUser.isVerified) {
      throw new AppError('Email already registered', 400);
    }
    
    // Kullanıcı var ancak doğrulanmamışsa yeni doğrulama tokenı oluşturup e-posta gönderir
    const token = tokenService.generateToken();
    const expiresAt = tokenService.getExpirationDate();
    await tokenRepository.create(existingUser.id, token, expiresAt);
    await mailService.sendVerificationEmail(email, token);
    
    return {
      success: true,
      message: 'Verification email sent.'
    };
  }
  
// Kullanıcı mevcut değilse yeni kullanıcı oluşturur
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await userRepository.create(email, passwordHash);
  
// Doğrulama tokenı oluşturur ve doğrulama e-postası gönderir
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
 * Doğrulama tokenı ile kullanıcının e-posta adresini doğrular
 * @param {string} token 
 * @returns {Promise<{success: boolean, message: string}>}
 */

const verifyEmail = async (token) => {
  
  const tokenData = await tokenRepository.findByToken(token);
  
  if (!tokenData) {
    throw new AppError('Invalid or expired token', 400);
  }
  
  if (tokenData.used) {
    throw new AppError('Token already used', 400);
  }
  
  // Tokenın süresinin dolmadığını kontrol eder
  const now = new Date();
  if (now > tokenData.expiresAt) {
    throw new AppError('Invalid or expired token', 400);
  }
  
  // Kullanıcının e-posta doğrulama durumunu günceller
  await userRepository.updateVerificationStatus(tokenData.userId, true);
  
  // Tokenı kullanılmış olarak işaretler
  await tokenRepository.markAsUsed(tokenData.id);
  
  return {
    success: true,
    message: 'Email verified.'
  };
};

/**
 *  Kullanıcıya doğrulama e-postası yeniden gönderir
 * @param {string} email 
 * @returns {Promise<{success: boolean, message: string}>}
 */
const resendVerification = async (email) => {
  // E-posta adresine göre kullanıcıyı getirir
  const user = await userRepository.findByEmail(email);
  
  // Kullanıcı bulunamazsa veya zaten doğrulanmışsa güvenlik nedeniyle başarılı yanıt döndürür (enumeration saldırılarını önlemek için)
  if (!user || user.isVerified) {
    return {
      success: true,
      message: 'Verification email sent.'
    };
  }
  
  // Kullanıcı mevcut ancak doğrulanmamışsa yeni doğrulama tokenı oluşturur ve e-posta gönderir
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
