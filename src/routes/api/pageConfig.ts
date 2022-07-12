import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    app.get('/', middlewares.isAuth, (req, res) => {
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    })

    app.post('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}