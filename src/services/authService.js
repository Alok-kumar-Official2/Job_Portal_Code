const UserRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const Apperror = require('../utils/Apperror');
const logger = require('../utils/loggerr');

const generateToken =  async (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const register = async (userData) => {
    const existingUser = await UserRepository.findByEmail(userData.email);

    if (existingUser) {
        throw new Apperror('Email already Registered', 400);
    }

    const user = await UserRepository.create({
        name: userData.email,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'JOB_SEEKER',
    });

    const token = await generateToken(user._id, user.role);

    logger.info(`New user registered: ${user.email} with role ${user.role} `);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

const login = async (email, password) => {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
        throw new Apperror('Invalid email or password', 401);
    }

    if (!user.isActive) {
        throw new Apperror("User Account is deactiated", 403);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid){
        throw new Apperror ('invalid Email or password' , 401);
    }

    await UserRepository.UpdateLastLogin(user._id);

    const token = await generateToken(user._id, user.role);

    logger.info(` user logged in successfuly : ${user.email}`);

    return {
        user : {
            id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
        },
        token
    };
};

module.exports = { register, login};