/**
 * Database helper utilities for testing
 * Provides functions to clean up test data
 */

const { query } = require('../../src/config/database');

/**
 * Clear all users from test database
 */
const clearUsers = async () => {
  await query('DELETE FROM users');
};

/**
 * Clear all tokens from test database
 */
const clearTokens = async () => {
  await query('DELETE FROM email_tokens');
};

/**
 * Clear all test data
 */
const clearAll = async () => {
  await clearTokens();
  await clearUsers();
};

/**
 * Create a test user
 * @param {Object} userData - User data
 * @returns {Promise<number>} User ID
 */
const createTestUser = async ({ email, passwordHash, isVerified = false }) => {
  const sql = 'INSERT INTO users (email, password_hash, is_verified) VALUES (?, ?, ?)';
  const result = await query(sql, [email, passwordHash, isVerified ? 1 : 0]);
  return result.insertId;
};

/**
 * Create a test token
 * @param {Object} tokenData - Token data
 * @returns {Promise<number>} Token ID
 */
const createTestToken = async ({ userId, token, expiresAt, used = false }) => {
  const sql = 'INSERT INTO email_tokens (user_id, token, expires_at, used) VALUES (?, ?, ?, ?)';
  const result = await query(sql, [userId, token, expiresAt, used ? 1 : 0]);
  return result.insertId;
};

module.exports = {
  clearUsers,
  clearTokens,
  clearAll,
  createTestUser,
  createTestToken
};
