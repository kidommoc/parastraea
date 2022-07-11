import dotenv from 'dotenv'
import path from 'path'

const envfound = dotenv.config()
if (envfound.error) {
    throw new Error("no .env file!")
}

process.env.ENV = process.env.ENV || 'development'
process.env.ROOT_PATH = path.join(path.dirname(require.main.filename), '..')

export default {
    environment: process.env.ENV,
    port: parseInt(process.env.PORT, 10),
    rootPath: process.env.ROOT_PATH,
    mongodbUri: process.env.MONGODB_URI,
}