import dotenv from 'dotenv';

dotenv.config()
export default{
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION,
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
}