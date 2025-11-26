const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const verifyEmailSchema = z.object({
  token: z.string().min(1)
});

const resendVerificationSchema = z.object({
  email: z.string().email()
});

module.exports = {
  registerSchema,
  verifyEmailSchema,
  resendVerificationSchema
};
