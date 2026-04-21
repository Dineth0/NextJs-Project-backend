import { dot } from "node:test/reporters";
import dotenv from 'dotenv';
import { NextFunction , Request , Response } from "express";
import UserModal from "../modals/UserModal";
import bcrypt from "bcrypt"


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