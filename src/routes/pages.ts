import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import path from 'path'

import config from '@/config'
import { PageConfigurator } from '@/services/PageConfiguration'
import { PageGenerator } from '@/services/PageGeneration'

export default (): Router => {
    let app = Router()
    let pageConfig = Container.get(PageConfigurator)
    let pageGenerator = Container.get(PageGenerator)

    pageConfig.getConfig().pages.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    // log
                    const filePath = path.join(config.rootPath, '/public', p.location)
                    res.sendFile(filePath)
                } catch (e) {
                    // log
                    next(e)
                }
            }
        )
        // log
    })

    pageConfig.getConfig().lists.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                try {
                    const html = pageGenerator.generateList(p.anthology, p.location)
                    res.send(html)
                } catch (e) {
                    // log
                    next(e)
                }
            }
        )
        // log
    })

    pageConfig.getConfig().articles.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                try {
                    const html = pageGenerator.generateArticle(req.params.title, p.anthology, p.location)
                    res.send(html)
                } catch (e) {
                    // log
                    next(e)
                }
            }
        )
        // log
    })

    return app
}