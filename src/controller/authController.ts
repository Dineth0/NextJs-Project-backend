import { dot } from "node:test/reporters";
import dotenv from 'dotenv';
import { NextFunction , Request , Response } from "express";
import UserModal from "../modals/UserModal";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../util/tokens";
import JwtConfig from "../config/JwtConfig";


dotenv.config()

export const signup = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const {name, email, password} = req.body
        if(!name || !email || !password){
            const error = new Error('All fields are required');
            (error as any).statusCode = 400;
            throw error;
        }

        const existigUser = await UserModal.findOne({email}).lean()
        if(existigUser){
            const error = new Error('USer with this email already exists');
            (error as any).statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await UserModal.create({
            name,
            email: email.toLowerCase(),
            password:hashedPassword,
        })

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        })
    }catch(error){
        next(error)
    }
}

export const login = async(req:Request, res:Response, next: NextFunction) =>{
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success: false, 
                message: "Email and password are required"
            })
        }

        const exisitingUser = await UserModal.findOne({email: email.toLowerCase()})
        if(!exisitingUser){
            return res.status(404).json({
                success: false, 
                message: "User Not Found"
            })
        }

        const correctPassword = await bcrypt.compare(password, exisitingUser.password)
        if(!correctPassword){
             return res.status(401).json({ 
                success: false, 
                message: "Invalid password" 
            });
        }
        const accessToken = generateAccessToken(exisitingUser)
        const RefreshToken = generateRefreshToken(exisitingUser)

        res.cookie('accessToken', accessToken,{
            httpOnly:true,
            secure:JwtConfig.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        })
        res.cookie('refreshToken', RefreshToken, {
            httpOnly: true,
            secure: JwtConfig.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/v1/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: exisitingUser._id,
                name: exisitingUser.name,
                email: exisitingUser.email,
                role: exisitingUser.role
            }
        })
    }catch(error){
        next(error)
    }
}