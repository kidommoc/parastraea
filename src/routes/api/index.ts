import { Router } from 'express'

import auth from './auth'
import pageConfig from './pageConfig'
import anthology from './anthology'
import article from './article'

export default (): Router => {
    let app = Router()
    app.use('/', auth())
    app.use('/pages', pageConfig())
    app.use('/anthology', anthology())
    app.use('/article', article())
    return app
}