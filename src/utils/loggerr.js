const winston = require('winston');
const path = require('path');

// Define your severity levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Define colors for console output (makes it pretty when you are developing locally)

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors);

// Create the actual logger format
const consoleFormat = winston.format.combine(
    // Add timestamp to every log
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Add colors if we are in development, otherwise just print raw JSON for production
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}] : ${info.message}`,
    )
);

// Format for files (NO colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // NO colorize here!
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

// Define which transports (destinations) the logger should write to
const transports = [
    new winston.transports.Console({
        format: consoleFormat,
    }),

    // 2. Log ALL errors to a specific file: logs/error.log
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
        format: fileFormat,
    }),

    // 3. Log EVERYTHING (info, warn, error, http) to a combined file: logs/combined.log
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/combined.log'),
        format: fileFormat,
    }),
];


// Initialize the logger
const logger = winston.createLogger(
    {
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
        levels,
        transports,
    }
);

module.exports = logger;
