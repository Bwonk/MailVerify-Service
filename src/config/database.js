const mysql = require('mysql2');
const config = require('./env');

/**
 * MySQL connection pool configuration
 */
const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Query wrapper function with promise support
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query results
 */
const query = async (sql, params = []) => {
  const promisePool = pool.promise();
  const [results] = await promisePool.query(sql, params);
  return results;
};

module.exports = {
  pool,
  query
};
