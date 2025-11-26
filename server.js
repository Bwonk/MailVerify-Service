/**
 * Application entry point
 * Validates environment configuration and starts the Express server
 */

// Import and validate environment configuration
// This will throw an error if any required variables are missing
const config = require('./src/config/env');

// Import Express app
const app = require('./src/app');

// Start server on configured PORT
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
}).on('error', (err) => {
  // Handle startup errors
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
