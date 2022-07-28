import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import path from 'path'

import config from '@/config'
import Errors from '@/Errors'
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
                    next(new Error(e.message))
                }
            }
        )
    })

    pageConfigurationServiceInstance.getConfig().lists.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                try {
                    const html = await pageGenerationServiceInstance
                        .generateList(p.anthology, p.location, 0)
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
                    next(new Error(e.message))
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
                    next(new Error(e.message))
                }
            }
        )
    })

    pageConfigurationServiceInstance.getConfig().articles.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                try {
                    const html = await pageGenerationServiceInstance
                        .generateArticle(req.params.title, p.anthology, p.location)
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
                    next(new Error(e.message))
                }
            }
        )
    })

    return app
}