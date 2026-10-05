// src/controllers/profileController.js
const profileService = require('../services/profileService');
const AppError = require('../utils/Apperror');
const logger = require('../utils/loggerr');

// GET /api/profiles/me
const getMyProfileController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    logger.info(`Fetching profile for userId: ${userId}`);

    const result = await profileService.getMyProfile(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profiles/me
const updateMyProfileController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    logger.info(`Updating profile for userId: ${userId}`);

    // Optional: Add Joi validation here later to sanitize req.body

    const updatedProfile = await profileService.updateMyProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfileController,
  updateMyProfileController,
};