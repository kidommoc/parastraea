import { Router } from 'express'

import pageRouter from './pages'

export default () => {
    let app = Router()
    app.use('/', pageRouter())
    return app
}