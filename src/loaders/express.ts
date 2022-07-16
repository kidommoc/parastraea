import express from 'express'
import cors from 'cors'

import config from '@/config'
import router from '@/routes'

export default (app: express.Application) => {

    app.use(express.json())

    if (config.environment == 'development')
        app.use(cors())

    app.use('/', router())

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(404)
    })

    // error handlers
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(err)
        res.status(400).send(err.message)
    })
}