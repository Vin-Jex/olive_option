import { Request, Response } from 'express';
import { log } from '../utils/logger';
import { 
    signupValidation,
    updateUserDetailsValidation,
    updateUserSettingsValidation,
    changePasswordValidation,
    resetOtpValidation,
    resetVerifyValidation,
    resetPasswordValidation,
    verifyOtpValidation,
    uploadProfilePicValidation
} from '../utils/validations/user.validation';
import { 
    signupService, 
    loginService, 
    meService,
    refreshService,
    updateUserDetailsService,
    updateUserSettingsService,
    changePasswordService,
    resetOtpService,
    resetVerifyService,
    resetPasswordService,
    verifyOtpService,
    uploadProfilePicService,
    toggleLiveService
} from '../services/user.service';
import { User } from '../models/User';
import { otp_types } from '../utils/consts';
import fs from 'fs';

export default {
    toggleLive : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, file } = req;

        try{
            let service = await toggleLiveService(user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    uploadProfilePic : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, file } = req;
        
        try{
            let payload = uploadProfilePicValidation(file);
            let service = await uploadProfilePicService(payload, user);
            fs.unlinkSync(`uploads_tmp/${payload.filename}`)
            return res.status(service.status).json({...service});
        }catch(error : any){
            if(file?.filename){
                fs.unlinkSync(`uploads_tmp/${file?.filename}`);
            }
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    verifyOtp : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { body, ip, url, user } = req;

        try{
            let payload = verifyOtpValidation(body);
            let service = await verifyOtpService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    resetPassword : async (req : Request, res : Response) : Promise<Response> =>{
        const { body, ip, url } = req;

        try{
            let payload = resetPasswordValidation(body);
            let service = await resetPasswordService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    resetVerify : async (req : Request, res : Response) : Promise<Response> =>{
        const { body, ip, url } = req;

        try{
            let payload = resetVerifyValidation(body);
            let service = await resetVerifyService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    resetOtp : async (req : any, res : Response, otp_type : otp_types = otp_types.reset_password) : Promise<Response> =>{
        const { body, ip, url, user } = req;

        if(user?.email){
            body.email = user.email;
        }

        try{
            let payload = resetOtpValidation(body);
            let service = await resetOtpService(payload, otp_type);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    signup : async (req : Request, res : Response) : Promise<Response> =>{
        const { body, ip, url } = req;

        try{
            let payload = signupValidation(body);
            let service = await signupService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    login : async (req : Request, res : Response) : Promise<Response> =>{
        const { body, ip, url } = req;

        try{
            let payload = signupValidation(body);
            let service = await loginService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    me : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user } = req;

        try{
            let service = await meService(user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            console.log(error);
            log('error', { error, ip, url })
            return res.status(error.status).json({...error});
        }
    },
    refresh : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user } = req;

        try{
            let service = await refreshService(user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url })
            return res.status(error.status).json({...error});
        }
    },
    updateUserDetails : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, body } = req;

        try{
            let payload = updateUserDetailsValidation(body);
            let service = await updateUserDetailsService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url })
            return res.status(error.status).json({...error});
        }
    },
    updateUserSettings  : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, body } = req;

        try{
            let payload = updateUserSettingsValidation(body);
            let service = await updateUserSettingsService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url })
            return res.status(error.status).json({...error});
        }
    },
    changePassword : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, body } = req;

        try{
            let payload = changePasswordValidation(body);
            let service = await changePasswordService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url })
            return res.status(error.status).json({...error});
        }
    }
}