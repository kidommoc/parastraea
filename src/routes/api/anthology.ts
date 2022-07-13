import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    // Get Articles in Anthology: `GET /api/anthology/:name/list`
    app.get('/:name/list',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let anthologyName = req.params.name
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    // New Anthology: `PUT /api/anthology`
    app.put('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    // Rename Anthology: `POST /api/anthology/:name`
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

    // Remove Anthology: `DELETE /api/anthology/:name`
    app.delete('/:name',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let anthologyName = req.params.name,
                isForced = req.body.force
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}