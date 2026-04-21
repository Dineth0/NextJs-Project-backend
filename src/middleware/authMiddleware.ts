import { NextFunction , Request , Response } from "express";
import UserModal, { IUser } from "../modals/UserModal";
import jwt, { Secret } from 'jsonwebtoken';
import JwtConfig from "../config/JwtConfig";

export interface AuthRequest extends Request{
    user?: IUser
}

export const authenticateUser = async(req:AuthRequest, res:Response, next: NextFunction)=>{
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
        return res.status(401).json({
            message: "No token, authorization denied"
        })
    }
    try{
        const decoded = jwt.verify(token, JwtConfig.JWT_SECRET as Secret) as {
            sub: string
            role: string
        }
        if(!decoded.sub){
           return res.status(401).json({message:"Token payload invalid"})
        }
        const user: IUser | null = await UserModal.findById(decoded.sub)

        if(!user){
            return res.status(401).json({ message: "User not found" })
        }
        req.user = user
        next()
    }catch(error){
        console.error(error)
        return res.status(401).json({ message: "Token is not valid" })
    }
    
}
export const authorizeRole = (roles: string[])=>{
    return(req:AuthRequest, res:Response, next:NextFunction)=>{
        if(!req.user || !roles.includes(req.user.role)){
             return res.status(403).json({ message: "Access denied" })

        }
    }
}
export const authorizeAdmin = authorizeRole(["Admin"])
export const authorizeUser = authorizeRole(["User"])