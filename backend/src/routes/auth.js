const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const ipWhitelist = require('../middleware/ipWhitelist');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', ipWhitelist, loginLimiter, login);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;
