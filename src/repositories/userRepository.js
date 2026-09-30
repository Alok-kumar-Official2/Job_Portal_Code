const User = require('../models/User');
const logger = require('../utils/loggerr');

const findByEmail = async (email) => {
    return await User.findOne({ email }).select('+password');
};

const findById = async (id) => {
    return await User.findById(id);
};

const create = async (userData) => {
    const user = await User.create(userData);
    logger.info(`User created : ${user.email}`);
    return user;

};

const UpdateLastLogin = async (id) => {
    return await User.findByIdAndUpdate(
        id,
        { lastLogin: new Date() },
        { new: true });
};


module.exports = {findByEmail,findById,create,UpdateLastLogin};