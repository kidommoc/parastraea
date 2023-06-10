import {
    Router,
    Request as RQ, Response as RS, NextFunction as NF,
} from 'express'
import { Container } from 'typedi'

import Errors from '@/Errors'
import middlewares from '@/routes/middlewares'
import {
    AnthologyService,
    ErrTypes as AnthologyErrs,
} from '@/services/Anthology'

export default (): Router => {
    let app = Router()
    let anthologyInst = Container.get(AnthologyService)

    // Get Anthology list: `GET /api/anthology/list`
    app.get('/list', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        try {
            const anthologies = await anthologyInst.getList()
            const result = { anthologies: anthologies }
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
            next(e)
        }
    })

    // Get Articles in Anthology: `GET /api/anthology/:name/list`
    app.get('/:name/list', middlewares.isAuth,
        async (req: RQ, res: RS, next: NF) => {
            // log
            const anthologyName = req.params.name
            try {
                const articles = await anthologyInst.getArticles(anthologyName)
                const result = { articles: articles }
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
                next(e)
            }
        }
    )

    // New Anthology: `PUT /api/anthology`
    app.put('/', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        const anthologyName = req.body.name
        try {
            await anthologyInst.create(anthologyName)
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
            next(e)
        }
    })

    // Rename Anthology: `POST /api/anthology/:name`
    app.post('/:name', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        const oldName = req.params.name
        const newName = req.body['new-name']
        try {
            await anthologyInst.rename(oldName, newName)
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
            next(e)
        }
    })

    // Remove Anthology: `DELETE /api/anthology/:name`
    app.delete('/:name', middlewares.isAuth, async (req: RQ, res: RS, next: NF) => {
        // log
        const anthologyName = req.params.name
        const isForced = req.body.force || false
        try {
            await anthologyInst.remove(anthologyName, isForced)
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
            next(e)
        }
    })

    return app
}