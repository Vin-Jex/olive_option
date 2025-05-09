import CryptoJS from 'crypto-js';
import env from '../config/config';
import rand from 'randomstring';
import { compareSync, hashSync } from 'bcryptjs';
import jwt from "jsonwebtoken";

export const encryptString = (string: string): string => {
    return CryptoJS.AES.encrypt(string, env.SECRET_KEY as string).toString();
}

export const decryptString = (encryptedString: string): string => {
    var bytes = CryptoJS.AES.decrypt(encryptedString, env.SECRET_KEY as string);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const generateRandomNumber = (length: number = 4) => {
    return rand.generate({ charset: 'numeric', length });
}


export const hashString = (string: string): string => {
    return hashSync(string, env.HASH_SALT);
}

export const compareString = (string: string, hash: string): boolean => {
    try {
        return compareSync(string, hash);
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const signObject = (payload : any, expiresIn="1h") : string =>{
    return jwt.sign(payload, env.SECRET_KEY, { expiresIn });
}

export const extractSignature = (token : string) : any =>{
    return jwt.verify(token, env.SECRET_KEY);
}
