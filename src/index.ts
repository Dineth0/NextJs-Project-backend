import { error } from "console"
import dotenv from "dotenv"
import express from "express"
import http from "http"
import mongoose from "mongoose"
dotenv.config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()
const server = http.createServer(app)
app.use(express.json())

const mongo = mongoose.connect(MONGO_URI)
mongo.then(()=>{
    console.log("MongoDB Connteced")
}).catch((error)=>{
    console.error(error)
})
server.listen(PORT, ()=>{
    console.log("Server Connected")
})