// src/server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const profileRoutes = require('./routes/profileRoutes');
const logger = require('./utils/loggerr');
const globalErrorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/Apperror');
const { connectMongoDB } = require('.//config/database')
const {verifyToken} = require('./middlewares/authMiddleware');

const app = express();

// 1. MIDDLEWARES
app.use(express.json());

// Morgan logs HTTP requests, but we route its output through our Winston logger!
const morganFormat = ':method :url :status :response-time ms';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.http(message.trim()),
    },
}));

// 2. A TEST ROUTE (To prove our architecture works)
app.get('/api/health', (req, res) => {
    logger.info('Health check endpoint hit');
    res.json({ status: 'success', message: 'Job Portal API is running!' });
});

// Let's create a fake error route to test our Global Error Handler
app.get('/api/test-error', (req, res, next) => {
    // We throw our custom AppError. Notice we don't need a try/catch block here!
    // We just pass it to `next()` and the globalErrorHandler catches it.
    next(new AppError('This is a test error to prove the global handler works!', 400));
});

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/api/test-protected', verifyToken,(req,res)=>{
    console.log("Protected route accessed");
    console.log( "User data : " , req.user);

    res.json({
        success : true,
        message : "You accesssed the protected route",
        user : req.user,
    });
});

// 3. GLOBAL ERROR HANDLER (MUST BE THE LAST MIDDLEWARE)
app.use(globalErrorHandler);


// 4. START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectMongoDB();

        app.listen(PORT, () => {
            logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error){
        logger.error('Failled to start server', error);
        process.exit(1);
    }
    };

    startServer();

