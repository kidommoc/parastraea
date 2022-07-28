import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import middlewares from '../middlewares'
import Errors from '@/Errors'
import { ErrTypes as AnthologyErrs, AnthologyService } from '@/services/Anthology'

export default (): Router => {
    let app = Router(),
        anthologyServiceInstance = Container.get(AnthologyService)

    // Get Anthology list: `GET /api/anthology/list`
    app.get('/list',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            try {
                let anthologies = await anthologyServiceInstance.getAnthologyList()
                let result = {
                    anthologies: anthologies
                }
                res.status(200).send(result)
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
                next(new Error(e.message))
            }
        }
    )

    // Get Articles in Anthology: `GET /api/anthology/:name/list`
    app.get('/:name/list',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let anthologyName = req.params.name
            try {
                let articles = await anthologyServiceInstance.getArticleList(anthologyName)
                let result = {
                    articles: articles
                }
                res.status(200).send(result)
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AnthologyErrs.NO_ANTHOLOGY:
                            res.status(499)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(new Error(e.message))
            }
        }
    )

    // New Anthology: `PUT /api/anthology`
    app.put('/',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let anthologyName = req.body.name
            try {
                await anthologyServiceInstance.createAnthology(anthologyName)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AnthologyErrs.DUMP_NAME:
                            res.status(499)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(new Error(e.message))
            }
        }
    )

    // Rename Anthology: `POST /api/anthology/:name`
    app.post('/:name',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let oldName = req.params.name,
                newName = req.body['new-name']
            try {
                await anthologyServiceInstance.renameAnthology(oldName, newName)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AnthologyErrs.NO_ANTHOLOGY:
                            res.status(499)
                            break
                        case AnthologyErrs.DUMP_NAME:
                            res.status(498)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(new Error(e.message))
            }
        }
    )

    // Remove Anthology: `DELETE /api/anthology/:name`
    app.delete('/:name',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            // log
            let anthologyName = req.params.name,
                isForced = req.body.force || false
            try {
                await anthologyServiceInstance.removeAnthology(anthologyName, isForced)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AnthologyErrs.NO_ANTHOLOGY:
                            res.status(499)
                            break
                        case AnthologyErrs.CONTAIN_ARTICLE:
                            res.status(498)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(new Error(e.message))
            }
        }
    )

    return app
}