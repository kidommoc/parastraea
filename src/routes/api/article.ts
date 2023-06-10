import {
    Router,
    Request as RQ, Response as RS, NextFunction as NF,
} from 'express'
import { Container } from 'typedi'

import Errors from '@/Errors'
import middlewares from '@/routes/middlewares'
import {
    ArticleService,
    ErrTypes as ArticleErrs,
} from '@/services/Article'

export default (): Router => {
    let app = Router()
    let articleInst = Container.get(ArticleService)

    // Get Article Details: `GET /api/article/:title`
    app.get('/:title', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        const articleTitle = req.params.title
        try {
            let result = await articleInst.getRaw(articleTitle)
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
    })

    // New Article: `PUT /api/article`
    app.put('/', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        const title = req.body.title
        const anthology = req.body.anthology
        const content = req.body.content
        try {
            await articleInst.create(title, anthology, content)
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
    })

    // Edit Article: `POST /api/article/:title`
    app.post('/:title', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        const article = req.params.title
        const title = req.body['new-title']
        const content = req.body['new-content']
        try {
            await articleInst.edit(article, title, content)
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
    })

    // Change Anthology of Article: `POST /api/article/:title/anthology`
    app.post('/:title/anthology', middlewares.isAuth,
        async (req: RQ, res: RS, next: NF) => {
            // log
            const article = req.params.title
            const anthology = req.body['new-anthology']
            try {
                await articleInst.move(article, anthology)
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
    app.delete('/:title', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        const article = req.params.title
        try {
            await articleInst.remove(article)
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
    })

    return app
}