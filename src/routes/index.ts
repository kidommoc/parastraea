import { Router } from 'express'

import pageRouter from './pages'
import api from './api'

export default (): Router => {
    let app = Router()
    app.use('/', pageRouter())
    app.use('/api', api())
    return app
}