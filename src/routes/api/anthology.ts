import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    app.get('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.put('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.post('/:name',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let anthologyName = req.params.name
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.delete('/:name',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let anthologyName = req.params.name
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}