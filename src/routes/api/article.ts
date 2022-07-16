import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import middlewares from '../middlewares'
import { ArticleService } from '@/services/Article'

export default (): Router => {
    let app = Router(),
        articleServiceInstance = Container.get(ArticleService)

    // Get Article Details: `GET /api/article/:title`
    app.get('/:title',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title
            try {
                let result = await articleServiceInstance.getArticleRawText(articleTitle)
                res.status(200).send(result)
            } catch (e) {
                next(e)
            }
        }
    )

    // New Article: `PUT /api/article`
    app.put('/',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let articleTitle= req.body.title,
                anthologyName = req.body.anthology,
                articleContent = req.body.content
            try {
                await articleServiceInstance.createArticle(
                    articleTitle,
                    anthologyName,
                    articleContent
                )
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    // Edit Article: `POST /api/article/:title`
    app.post('/:title',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title,
                newContent = req.body.content
            try {
                await articleServiceInstance.editArticle(articleTitle, newContent)
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    // Change Anthology of Article: `POST /api/article/:title/anthology`
    app.post('/:title/anthology',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title,
                anthologyName = req.body.anthology
            try {
                await articleServiceInstance.changeAnthology(articleTitle, anthologyName)
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    // Remove Article: `DELETE /api/article/:title`
    app.delete('/:title',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let articleTitle = req.params.title
            try {
                await articleServiceInstance.removeArticle(articleTitle)
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}