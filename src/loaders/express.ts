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
        res.status(404).send()
    })

    // error handlers
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(err)
        res.send(err.message)
    })
}