const jwt = require('jsonwebtoken');
const Apperror = require('../utils/Apperror');
const userRepository = require('../repositories/userRepository');

const verifyToken = async (req,res,next)=>{
    try{
        console.log("Verify token midddleware");
        

        const authHeader = req.headers.authorization;  // ❌ Capital 'A'

        console.log("Auth Header:", authHeader);

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new Apperror("Access Denied. No Token Provide",401);
        }

        const token = authHeader.split(' ')[1];

        console.log("token decoded : " , token.substring(0,20) + "...");

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        console.log("token decoded :" , decoded);

        req.user = decoded;

        console.log("User attached to request :" ,  req.user);

        next();
    }catch(error){
        if(error.name === "JsonWebTokenError"){
            next(new Apperror("invalid token", 401));
        }
        else if( error.name === "TokenExpiredError"){
            next( new Apperror( "Token expired", 401));
        }
        else{
            next(error);
        }
    }
};

module.exports = {verifyToken}