import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import middlewares from '../middlewares'
import Errors from '@/Errors'
import { PageConfigurationService } from '@/services/PageConfiguration'

export default (): Router => {
    let app = Router()
    let pageConfigurationServiceInstance = Container.get(PageConfigurationService)

    // Get Configuration: `GET /api/pages`
    app.get('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            // log
            console.log('REQUEST: GET /api/pages')
            try {
                const pageConfigJson = pageConfigurationServiceInstance.toString()
                res.status(200).send(pageConfigJson)
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

    // Modify Configuration: `POST /api/pages`
    app.post('/',
        middlewares.isAuth,
        (req: Request, res: Response, next: NextFunction) => {
            // log
            console.log('REQUEST: POST /api/pages')
            let newConfig = req.body['page-config']
            try {
                pageConfigurationServiceInstance.updateConfig(newConfig)
                pageConfigurationServiceInstance.saveConfig()
                // log
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
                next(new Error(e.message))
            }
        }
    )

    return app
}