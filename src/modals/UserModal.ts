import mongoose, { Schema } from "mongoose";

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId
    name: string
    email: string
    password: string
    image?: string
    role: "Admin" | "User"

}

const userSchema = new Schema<IUser>({
    name:{
        type:String,
        minlength: [2, "Name must be at least 2 characters"],
         required: [true, "Name is required"],
        trim: true,
    },
    email:{
        type:String,
        unique: [true, "Librarian already registered"],
        required: [true, "Email is required"],
        trim: true,
        index: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Email must be valid"],
    },
    password:{
        type:String,
         required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
    },
     image:{
                type:String, 
                required:false
    },
    role:{
        type:String,
        enum:["Admin", "User"],
        default:"User"
    }
   
},{timestamps: true})

export default mongoose.model<IUser>("User", userSchema)