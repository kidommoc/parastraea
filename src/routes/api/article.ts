import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    app.get('/article/:title',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.put('/article',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.post('/article/:title',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
        let articleTitle = req.params.title
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.post('/articles/anthology',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    app.delete('/articles',
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