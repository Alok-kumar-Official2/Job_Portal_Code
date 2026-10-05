// src/services/profileService.js
const profileRepository = require('../repositories/profileRepository');
const AppError = require('../utils/Apperror');
const logger = require('../utils/loggerr');

// Get the logged-in user's profile
const getMyProfile = async (userId) => {
  const profile = await profileRepository.findByUserId(userId);
  
  if (!profile) {
    // Return an empty structure if they haven't created one yet
    return { message: 'Profile not found. Please create one.', data: null };
  }
  
  return profile;
};

// Create or Update the logged-in user's profile
const updateMyProfile = async (userId, profileData) => {
  // Security check: Ensure the userId in the token matches the profile being updated
  // (This is already guaranteed by our controller, but good practice in services)
  
  const profile = await profileRepository.upsertProfile(userId, profileData);
  return profile;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};