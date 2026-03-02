const crypto = require('crypto');

/**
 *  Kriptografik olarak rastgele bir token üretir
 * @returns {string} 64 karakterlik hexadecimal
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Token için son geçerlilik tarihini hesaplar (şu andan itibaren 24 saat)
 * @returns {Date} Son geçerlilik tarihi 
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
