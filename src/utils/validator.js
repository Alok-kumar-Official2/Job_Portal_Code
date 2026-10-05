const Joi = require('joi');

const registerSchema = Joi.object({
    name : Joi.string().min(2).max(50).required().messages({
        'string.empty' : 'Name is required',
        'string.min': 'Name must be atleast 2 chracters',
        'string.max':'Name cannot me more than 50 chracters',
    }),

    email : Joi.string()
    .email({minDomainSegments : 2 })
    .required()
    .messages({
        'string.email': 'Please provide a  valid email address',
    }),

    password : Joi.string().min(6).required()
    .pattern( new RegExp ('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .messages({
        'string.min' : 'Password must be atleast 6 chracter',
        'string.pattern.base': 'password must contain at least one uppercase letter one lowercase letter and one number',
    }),

    role : Joi.string().valid('JOB_SEEKER', "EMPLOYER").default('JOB_SEEKER'),

});


const loginSchema = Joi.object({
    email : Joi.string().required().email(),
    password : Joi.string().required().min(6)
});

module.exports = {registerSchema, loginSchema };