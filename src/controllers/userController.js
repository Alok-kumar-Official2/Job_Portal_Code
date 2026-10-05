const userRepository = require('../repositories/userRepository');
const Apperror = require('../utils/Apperror');
const logger = require('../utils/loggerr');

const getMe = async (req,res,next)=>{
    try{
        logger.info("fetching profile for userid :" , req.user.userId);

        const user = await userRepository.findById(req.user.userId);

        if(!user){
            throw new Apperror("User no longer exists :",404);
        }

        res.status(200).json({
            success : true,
            data : {
                user,
            }
        });
    }catch(error){
        next(error);
    }
};

module.exports = {getMe};