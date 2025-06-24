const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @route GET /api/auth/google
// @desc Redirect to Google OAuth
// @access Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route GET /api/auth/google/callback
// @desc Google OAuth callback
// @access Public
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      // Tạo JWT token
      const payload = {
        user: {
          id: req.user._id,
          role: req.user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '40h' },
        (err, token) => {
          if (err) {
            console.error('JWT signing error:', err);
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
          }

          // Redirect về frontend với token
          const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
          res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            avatar: req.user.avatar,
            phone: req.user.phone,
            address: req.user.address,
            createdAt: req.user.createdAt
          }))}`);
        }
      );
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendURL}/login?error=auth_failed`);
    }
  }
);

// @route GET /api/auth/logout
// @desc Logout user
// @access Public
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router; 