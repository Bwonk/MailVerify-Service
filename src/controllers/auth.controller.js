// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');
const config = require('../config/env');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.register(email, password);
    return res.status(200).json(successResponse(result.message));
  } catch (error) {
    return next(error);
  }
};

// ✅ Mailden gelen GET isteği burada karşılıyoruz
const verifyEmail = async (req, res, next) => {
  try {
    console.log('>>> verifyEmail HIT', {
      method: req.method,
      query: req.query,
    });

    const { token } = req.query;

    if (!token) {
      console.log('>>> verifyEmail: token YOK');
      return res.redirect(`${config.APP_BASE_URL}?verify=error`);
    }

    await authService.verifyEmail(token);
    console.log('>>> verifyEmail: SUCCESS');

    return res.redirect(`${config.APP_BASE_URL}?verify=ok`);
  } catch (error) {
    console.error('>>> verifyEmail ERROR', error);
    return res.redirect(`${config.APP_BASE_URL}?verify=error`);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    return res.status(200).json(successResponse(result.message));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
};

