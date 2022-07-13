import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    // Get Configuration: `GET /api/pages`
    app.get('/', middlewares.isAuth, (req, res) => {
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    })

    // Modify Configuration: `POST /api/pages`
    app.post('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let newConfig = req.body['page-config']
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}