import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    // Login: `POST /api/login`
    app.post('/login',
        (req: Request, res: Response, next: NextFunction) => {
            let passwordHashed = req.body.password
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    // Logout: `POST /api/logout`
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