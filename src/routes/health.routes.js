const express = require('express');

const router = express.Router();

// GET /health - Sistem durumunu kontrol eden endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
