import { StatusCodes } from 'http-status-codes';
import { User } from '../../models/User';
import { ResponseType } from '../../types/api.types';
import { messages } from '../../utils/consts';

export const dashboardService = async () : Promise<ResponseType> =>{
    let total_no_users = await User.count();
    let total_no_active_users = await User.count({ where : { is_disabled : false } });
    let total_no_pending_withdrawals = 0;
    let total_no_pending_payouts = 0;

    return { ok : true, message : messages.OK, status : StatusCodes.OK,  body : { 
        total_no_active_users, total_no_users, total_no_pending_payouts, total_no_pending_withdrawals
    } }
}