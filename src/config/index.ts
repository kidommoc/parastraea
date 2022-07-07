import dotenv from 'dotenv'

const envfound = dotenv.config()
if (envfound.error) {
    throw new Error("no .env file!")
}

process.env.ENV = process.env.ENV || 'development'

export default {
    environment: process.env.ENV,
    port: parseInt(process.env.PORT, 10),
    mongodbUri: process.env.MONGODB_URI,
}