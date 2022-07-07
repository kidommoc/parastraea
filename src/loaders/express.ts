import express from 'express'
import cors from 'cors'

import config from '@/config'
import router from '@/routes'

export default (app: express.Application) => {
    app.use(express.json())
    if (config.environment == 'development')
        app.use(cors())

    app.use('/', router())

    // error handlers
}