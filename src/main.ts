import express from 'express';
import loader from './loaders';

async function startServer() {
    const app = express()
    await loader(app, (app: express.Express, port: number) => {
        app.listen(port, () => {
            console.log(`Server started at port ${port}`)
        })
    })
}

startServer();