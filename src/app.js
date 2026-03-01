const express = require('express');
const cors = require('cors'); //CORS paketi
const authRoutes = require('./routes/auth.routes');
const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Express application setup
 * Configures middleware, routes, and error handling
 */

// Initialize Express app
const app = express();

/** CORS AYARLARI */
// Sadece frontend domainine izin veriyoruz
app.use(
  cors({
    origin: 'https://app.yigitlabs.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Preflight OPTIONS (tarayıcı önce bunu atıyor)
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/', healthRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;
