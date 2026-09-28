const mongoose = require('mongoose');

const logger = require('../utils/loggerr');

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex : true,
            maxPoolSize : 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 4500,
        });

        logger.info(`MongoDB connected  : ${conn.connection.host} `);

        mongoose.connection.on('error', (error) => {
            logger.error(` Mongodb coonnection error ${error.message}`)
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn(" Mongo Db Disconnected");
        })
    } catch (error) {
        logger.error( ` Mongo connection failed : ${error.message}`);
        process.exit(1);
    }
};

process.on('SIGINT', async ()=>{
    await mongoose.connection.close();
    logger.info(' Mongose connection close due to app terination');
    process.exit(0);
});

module.exports = {connectMongoDB};