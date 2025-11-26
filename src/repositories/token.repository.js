const { query } = require('../config/database');

/**
 * Create a new email verification token
 * @param {number} userId - User ID
 * @param {string} token - Verification token
 * @param {Date} expiresAt - Token expiration date
 * @returns {Promise<number>} Created token ID
 */
const create = async (userId, token, expiresAt) => {
  const sql = 'INSERT INTO email_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
  const result = await query(sql, [userId, token, expiresAt]);
  return result.insertId;
};

/**
 * Find token by token string with user information
 * @param {string} token - Verification token
 * @returns {Promise<Object|null>} Token object with user info or null if not found
 */
const findByToken = async (token) => {
  const sql = `
    SELECT 
      t.id,
      t.user_id,
      t.token,
      t.expires_at,
      t.used,
      u.email,
      u.is_verified
    FROM email_tokens t
    JOIN users u ON t.user_id = u.id
    WHERE t.token = ?
  `;
  const results = await query(sql, [token]);
  
  if (results.length === 0) {
    return null;
  }
  
  const row = results[0];
  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    expiresAt: row.expires_at,
    used: Boolean(row.used),
    user: {
      email: row.email,
      isVerified: Boolean(row.is_verified)
    }
  };
};

/**
 * Mark token as used
 * @param {number} tokenId - Token ID
 * @returns {Promise<void>}
 */
const markAsUsed = async (tokenId) => {
  const sql = 'UPDATE email_tokens SET used = 1 WHERE id = ?';
  await query(sql, [tokenId]);
};

/**
 * Delete expired and used tokens
 * @returns {Promise<void>}
 */
const deleteExpiredTokens = async () => {
  const sql = 'DELETE FROM email_tokens WHERE expires_at < NOW() OR used = 1';
  await query(sql);
};

module.exports = {
  create,
  findByToken,
  markAsUsed,
  deleteExpiredTokens
};
