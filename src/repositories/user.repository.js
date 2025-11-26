const { query } = require('../config/database');

/**
 * Find user by email address
 * @param {string} email - User email address
 * @returns {Promise<Object|null>} User object or null if not found
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
 * Create a new user
 * @param {string} email - User email address
 * @param {string} passwordHash - Hashed password
 * @returns {Promise<number>} Created user ID
 */
const create = async (email, passwordHash) => {
  const sql = 'INSERT INTO users (email, password_hash, is_verified) VALUES (?, ?, 0)';
  const result = await query(sql, [email, passwordHash]);
  return result.insertId;
};

/**
 * Update user verification status
 * @param {number} userId - User ID
 * @param {boolean} isVerified - Verification status
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
