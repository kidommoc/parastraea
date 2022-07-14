import { Router } from 'express'

import pageRouter from './pages'
import managePageRouter from './managePages'
import api from './api'

export default (): Router => {
    let app = Router()
    app.use('/', pageRouter())
    app.use('/manage', managePageRouter())
    app.use('/api', api())
    return app
}