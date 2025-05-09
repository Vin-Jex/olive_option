import winston from 'winston';
import path from 'path';

export const logger = winston.createLogger({
    transports : []
});

logger.add(new winston.transports.File({ filename : path.resolve(__dirname, '../../logs/info.log'), level : 'info' }));
logger.add(new winston.transports.File({ filename : path.resolve(__dirname, '../../logs/error.log'), level : 'error' }));

if(process.env.NODE_ENV != 'production'){
    logger.add(new winston.transports.Console());
}