import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import path from 'path'

import config from '@/config'
import { PageConfigurationService } from '@/services/PageConfiguration'
import { PageGenerationService } from '@/services/PageGeneration'

export default (): Router => {
    let app = Router()
    let pageConfigurationServiceInstance = Container.get(PageConfigurationService)
    let pageGenerationServiceInstance = Container.get(PageGenerationService)

    pageConfigurationServiceInstance.getConfig().pages.forEach(p => {
        app.get(p.url,
            (req: Request, res: Response, next: NextFunction) => {
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

    pageConfigurationServiceInstance.getConfig().lists.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                try {
                    const html = await pageGenerationServiceInstance
                        .generateList(p.anthology, p.location, 0)
                    res.send(html)
                } catch (e) {
                    // log
                    next(e)
                }
            }
        )
        app.get(p.url + '/:page(\d+)',
            async (req: Request, res: Response, next: NextFunction) => {
                let page: number = +req.params.page
                // log
                try {
                    const html = await pageGenerationServiceInstance
                        .generateList(p.anthology, p.location, page - 1)
                    res.send(html)
                } catch (e) {
                    // log
                    next(e)
                }
            }
        )
        // log
    })

    pageConfigurationServiceInstance.getConfig().articles.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                try {
                    const html = await pageGenerationServiceInstance
                        .generateArticle(req.params.title, p.anthology, p.location)
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