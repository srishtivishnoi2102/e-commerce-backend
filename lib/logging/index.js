const winston = require('winston');

const myFormat = winston.format.combine(winston.format.timestamp(), winston.format.json() ) ;
const logger = winston.createLogger({
    transports : [
        new winston.transports.File({
            filename : 'logs/server.log',
            level : 'info',
            format : myFormat,
        }),

        new winston.transports.File({
            filename : 'logs/error.log',
            level : 'error'
        }),


    ]
});

module.exports = logger;