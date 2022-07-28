import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import path from 'node:path'

import config from '@/config'
import Errors from '@/Errors'
import { PageConfigurationService } from '@/services/PageConfiguration'
import { PageGenerationService } from '@/services/PageGeneration'

export default (): Router => {
    let app = Router()
    let pageConfigurationServiceInstance = Container.get(PageConfigurationService)
    let pageGenerationServiceInstance = Container.get(PageGenerationService)

    const pageConfig = pageConfigurationServiceInstance.getConfig()

    pageConfig.pages.forEach(p => {
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

    pageConfig.lists.forEach(p => {
        app.get(`${p.url}/:page(\d+)?`,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                const page: number = req.params.page ? Number(req.params.page) - 1 : 0
                const filePath = path.join(config.rootPath, '/public', p.location)
                try {
                    const html = await pageGenerationServiceInstance
                        .generateList(p.anthology, filePath, page)
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

    pageConfig.articles.forEach(p => {
        app.get(p.url,
            async (req: Request, res: Response, next: NextFunction) => {
                // log
                const filePath = path.join(config.rootPath, '/public', p.location)
                try {
                    const html = await pageGenerationServiceInstance
                        .generateArticle(req.params.title, filePath)
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

    app.get('/',
        (req: Request, res: Response, next: NextFunction) => {
            res.redirect(pageConfig.entry)
        }
    )

    return app
}