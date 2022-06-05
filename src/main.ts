import express from 'express';

async function startServer() {
    const app = express()
    app.listen(process.env.PORT, () => {
        console.log('Server started!')
    })
}

startServer();
