const crypto = require('crypto');

/**
 * Generate a cryptographically secure random token
 * @returns {string} 64-character hexadecimal token
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Get expiration date for token (24 hours from now)
 * @returns {Date} Expiration date
 */
const getExpirationDate = () => {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);
  return expirationDate;
};

module.exports = {
  generateToken,
  getExpirationDate
};
