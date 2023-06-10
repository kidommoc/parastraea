import {
    Router,
    Request as RQ, Response as RS, NextFunction as NF
} from 'express'
import { Container } from 'typedi'
import path from 'node:path'

import config from '@/config'
import Errors from '@/Errors'
import { PageManagementService } from '@/services/PageManagement'
import { PageGenerationService } from '@/services/PageGeneration'

export default (): Router => {
    let app = Router()
    let pageMngInst = Container.get(PageManagementService)
    let pageGenInst = Container.get(PageGenerationService)

    const pageConfig = pageMngInst.config

    for (const p of pageConfig.pages) {
        app.get(p.url, (req: RQ, res: RS, next: NF) => {
            try {
                // log
                const filePath = path.resolve(config.rootPath, 'public/pages', p.location)
                res.header('Content-Type', 'text/html')
                res.sendFile(filePath)
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
    }

    for (const p of pageConfig.lists) {
        app.get(`${p.url}/:page(\d+)?`, async (req: RQ, res: RS, next: NF) => {
            // log
            const page: number = req.params.page ? Number(req.params.page) - 1 : 0
            const filePath = path.resolve(config.rootPath, 'public/pages', p.location)
            try {
                const html = await pageGenInst.generateList(p.anthology, filePath, page)
                res.header('Content-Type', 'text/html')
                res.send(html)
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
    }

    for (const p of pageConfig.articles) {
        app.get(p.url, async (req: RQ, res: RS, next: NF) => {
            // log
            const filePath = path.resolve(config.rootPath, 'public/pages', p.location)
            try {
                const html = await pageGenInst.generateArticle(req.params.title, filePath)
                res.header('Content-Type', 'text/html')
                res.send(html)
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
    }

    app.get('/', (req: RQ, res: RS, next: NF) => {
        res.redirect(pageConfig.entry)
    })

    return app
}