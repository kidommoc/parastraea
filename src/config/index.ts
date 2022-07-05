import dotenv from 'dotenv'

const envfound = dotenv.config()
if (envfound.error) {
    throw new Error("no .env file")
}

export default {
    port: parseInt(process.env.PORT, 10),
}