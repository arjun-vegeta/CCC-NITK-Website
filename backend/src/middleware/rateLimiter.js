const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[SECURITY] Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ 
      error: 'Too many login attempts. Please try again after 15 minutes.' 
    });
  }
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, apiLimiter };
