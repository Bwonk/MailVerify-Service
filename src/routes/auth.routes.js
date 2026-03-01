const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validator');
const {
  registerSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} = require('../validators/auth.validator');

const router = express.Router();

// POST /api/auth/register - Yeni kullanıcı kaydı oluşturur
router.post('/register', validate(registerSchema), authController.register);

// GET /api/auth/verify-email - E-posta doğrulama linki buraya yönlenir
// Token query parametresinden alındığı için validate middleware kullanılmaz
router.get('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-verification - Doğrulama e-postasını yeniden gönderir
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  authController.resendVerification
);

module.exports = router;



