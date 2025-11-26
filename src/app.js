const express = require('express');
const authRoutes = require('./routes/auth.routes');
const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Express application setup
 * Configures middleware, routes, and error handling
 */

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/', healthRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;
