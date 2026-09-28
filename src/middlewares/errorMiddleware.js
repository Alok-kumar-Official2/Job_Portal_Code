const logger = require('../utils/loggerr');

// This middleware catches ALL errors thrown in the app
const globalErrorHandler = (err,req,res,next) => {
    err.statuscode = err.statuscode || 500 ;
    err.status = err.status || 'err';


  // Log the error using our Winston logger!
logger.error( ` [ERROR] ${err.statuscode}  - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}` );

res.status(err.statuscode).json({
    success : false,
    status : err.status,
    message : err.isOperational ? err.message : 'An unexpected internal sever error occured',
      // NEVER send stack traces to the client in production!
    stack : process.env.NODE_ENV === 'development' ? err.stack : undefined,
});
};

module.exports = globalErrorHandler;