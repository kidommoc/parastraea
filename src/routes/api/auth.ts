import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    app.post('/login',
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.post('/logout',
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