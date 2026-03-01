const { query } = require('../config/database');

/**
 * E-posta adresine göre kullanıcıyı getirir
 * @param {string} email 
 * @returns {Promise<Object|null>} -Kullanıcı nesnesi döner, bulunamazsa null döner
 */
const findByEmail = async (email) => {
  const sql = 'SELECT id, email, password_hash, is_verified FROM users WHERE email = ?';
  const results = await query(sql, [email]);
  
  if (results.length === 0) {
    return null;
  }
  
  const user = results[0];
  return {
    id: user.id,
    email: user.email,
    passwordHash: user.password_hash,
    isVerified: Boolean(user.is_verified)
  };
};

/**
 * Yeni kullanıcı oluşturur
 * @param {string} email 
 * @param {string} passwordHash 
 * @returns {Promise<number>} 
 */
const create = async (email, passwordHash) => {
  const sql = 'INSERT INTO users (email, password_hash, is_verified) VALUES (?, ?, 0)';
  const result = await query(sql, [email, passwordHash]);
  return result.insertId;
};

/**
 * Kullanıcının e-posta doğrulama durumunu günceller
 * @param {number} userId 
 * @param {boolean} isVerified 
 * @returns {Promise<void>}
 */
const updateVerificationStatus = async (userId, isVerified) => {
  const sql = 'UPDATE users SET is_verified = ? WHERE id = ?';
  await query(sql, [isVerified ? 1 : 0, userId]);
};

module.exports = {
  findByEmail,
  create,
  updateVerificationStatus
};
