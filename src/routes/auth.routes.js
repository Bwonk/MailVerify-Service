// src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validator');
const {
  registerSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} = require('../validators/auth.validator');

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', validate(registerSchema), authController.register);

// ✅ GET /api/auth/verify-email - Mailden gelen link buraya gelir
//  BURADA validate KULLANMIYORUZ, token query'den geliyor
router.get('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-verification - Resend verification email
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  authController.resendVerification
);

module.exports = router;



