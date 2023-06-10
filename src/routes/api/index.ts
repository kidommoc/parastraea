import { Router } from 'express'

import auth from '@/routes/api/auth'
import pageMng from '@/routes/api/pagemng'
import anthology from '@/routes/api/anthology'
import article from '@/routes/api/article'

export default (): Router => {
    let app = Router()
    app.use('/', auth())
    app.use('/pages', pageMng())
    app.use('/anthology', anthology())
    app.use('/article', article())
    return app
}