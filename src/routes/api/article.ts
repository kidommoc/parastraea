import { Router, Request, Response, NextFunction } from 'express'

import middlewares from '../middlewares'

export default (): Router => {
    let app = Router()

    // Get Article Details: `GET /api/article/:title`
    app.get('/:title',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    // New Article: `PUT /api/article`
    app.put('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let articleTitle= req.body.title,
                anthologyName = req.body.anthology,
                articleContent = req.body.content
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    // Edit Article: `POST /api/article/:title`
    app.post('/:title',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title,
                newContent = req.body.content
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    // Change Anthology of Article: `POST /api/article/:title/anthology`
    app.post('/:title/anthology',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title,
                anthologyName = req.body.anthology
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    // Remove Article: `DELETE /api/article/:title`
    app.delete('/:title',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title
            try {
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}