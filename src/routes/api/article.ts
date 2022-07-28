import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import middlewares from '../middlewares'
import Errors from '@/Errors'
import { ErrTypes as ArticleErrs, ArticleService } from '@/services/Article'

export default (): Router => {
    let app = Router(),
        articleServiceInstance = Container.get(ArticleService)

    // Get Article Details: `GET /api/article/:title`
    app.get('/:title',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let articleTitle = req.params.title
            try {
                let result = await articleServiceInstance.getArticleRawText(articleTitle)
                res.status(200).send(result)
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case ArticleErrs.NO_ARTICLE:
                            res.status(499)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(e)
            }
        }
    )

    // New Article: `PUT /api/article`
    app.put('/',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
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
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case ArticleErrs.DUMP_NAME:
                            res.status(499)
                            break
                        case ArticleErrs.NO_ANTHOLOGY:
                            res.status(498)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(e)
            }
        }
    )

    // Edit Article: `POST /api/article/:title`
    app.post('/:title',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let articleTitle = req.params.title,
                newTitle = req.body['new-title'],
                newContent = req.body['new-content']
            try {
                await articleServiceInstance.editArticle(articleTitle, newTitle, newContent)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case ArticleErrs.NO_ARTICLE:
                            res.status(499)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(e)
            }
        }
    )

    // Change Anthology of Article: `POST /api/article/:title/anthology`
    app.post('/:title/anthology',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let articleTitle = req.params.title,
                anthologyName = req.body['new-anthology']
            try {
                await articleServiceInstance.changeAnthology(articleTitle, anthologyName)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case ArticleErrs.NO_ARTICLE:
                            res.status(499)
                            break
                        case ArticleErrs.NO_ANTHOLOGY:
                            res.status(498)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(e)
            }
        }
    )

    // Remove Article: `DELETE /api/article/:title`
    app.delete('/:title',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let articleTitle = req.params.title
            try {
                await articleServiceInstance.removeArticle(articleTitle)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(e)
            }
        }
    )

    return app
}