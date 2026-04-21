import dotenv from 'dotenv';
import { IUser } from '../modals/UserModal';
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import JwtConfig from '../config/JwtConfig';

dotenv.config()

export interface JwtPayload{
    sub:string
    role:string
    iat?:string
    exp?:string
}

export const generateAccessToken = (user:IUser)=>{
    const payload:JwtPayload={
        sub: user._id.toString(),
        role: user.role
    }

    const option: SignOptions={
        expiresIn: (JwtConfig.JWT_ACCESS_EXPIRATION as any)
    }
    return jwt.sign(payload, JwtConfig.JWT_SECRET as Secret, option)
}

export const generateRefreshToken = (user:IUser)=>{
    const payload = {
        sub: user._id.toString()
    }

    const option: SignOptions ={
        expiresIn: (JwtConfig.JWT_REFRESH_EXPIRATION as any)

    }
    return jwt.sign(payload, JwtConfig.JWT_REFRESH_SECRET as Secret, option)
}