import { logger } from '../config/logger';

export const log = (level : string, message : any) : void =>{
    logger.log(level, { timestamp : new Date(), message })
}