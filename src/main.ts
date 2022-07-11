import 'reflect-metadata'
import express from 'express';

import config from './config'
import loader from './loaders';

async function startServer() {
    const app = express()
    await loader(app)
    app.listen(process.env.PORT, () => {
        // log something
        console.log(`server starts on ${config.port}`)
    })
}

startServer();