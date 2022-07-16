import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import middlewares from '../middlewares'
import { AnthologyService } from '@/services/Anthology'

export default (): Router => {
    let app = Router()
    let anthologyServiceInstance = Container.get(AnthologyService)

    // Get Articles in Anthology: `GET /api/anthology/:name/list`
    app.get('/:name/list',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let anthologyName = req.params.name
            try {
                let articles = await anthologyServiceInstance.getArticleList(anthologyName)
                let result = {
                    articles: articles
                }
                res.status(200).send(result)
            } catch (e) {
                next(e)
            }
        }
    )

    // New Anthology: `PUT /api/anthology`
    app.put('/',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let anthologyName = req.body.name
            try {
                await anthologyServiceInstance.createAnthology(anthologyName)
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    // Rename Anthology: `POST /api/anthology/:name`
    app.post('/:name',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let oldName = req.params.name,
                newName = req.body['new-name']
            try {
                await anthologyServiceInstance.renameAnthology(oldName, newName)
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    // Remove Anthology: `DELETE /api/anthology/:name`
    app.delete('/:name',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            let anthologyName = req.params.name,
                isForced = req.body.force || false
            try {
                await anthologyServiceInstance.removeAnthology(anthologyName, isForced)
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}