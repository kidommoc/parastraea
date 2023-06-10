import { Router } from 'express'

import pageRouter from '@/routes/pages'
import mngRouter from '@/routes/mngs'
import api from '@/routes/api'

export default (): Router => {
    let app = Router()
    app.use('/', pageRouter())
    app.use('/manage', mngRouter())
    app.use('/api', api())
    return app
}