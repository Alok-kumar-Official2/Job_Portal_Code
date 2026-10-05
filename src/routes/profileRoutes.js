// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();

const { 
  getMyProfileController, 
  updateMyProfileController 
} = require('../controllers/profileController');

const { verifyToken } = require('../middlewares/authMiddleware');

// Optional: Create a simple role-checking middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new (require('../utils/Apperror'))('Forbidden: Insufficient permissions', 403));
    }
    next();
  };
};

// Protect routes: Token must be valid AND role must be JOB_SEEKER
router.get('/me', verifyToken, authorize(['JOB_SEEKER']), getMyProfileController);
router.put('/me', verifyToken, authorize(['JOB_SEEKER']), updateMyProfileController);

module.exports = router;