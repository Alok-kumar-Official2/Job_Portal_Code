const authService = require('../services/authService');
const {registerSchema, loginSchema } = require('../utils/validator');
const Apperror = require('../utils/Apperror');
const logger = require('../utils/loggerr');

const registerController = async (req,res,next) =>{
    try{
        const {error, value} = registerSchema.validate(req.body);
        if (error){
            throw new Apperror(error.details[0].message , 400 );
        }

        const result = await authService.register(value);

        res.status(200).json({
            success : true,
            message : 'User registered Successfully',
            data : result,
        })
    }catch(error){
        next(error);
    }
};


const loginController = async (req,res,next) => {
    try {
        const {error,value} = loginSchema.validate(req.body);
        if (error){
            throw new Apperror(error.details[0].message , 400);
        }

        const result = await authService.login(value.email , value.password);

        res.status(200).json({
            success : true,
            message : "Login Successful",
            data : result,
        });
    }catch(error){
        next(error);
    }
};

module.exports = {registerController,loginController};