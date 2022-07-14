import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import middlewares from '../middlewares'
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
                console.log(pageConfigJson)
                res.status(200).send(pageConfigJson)
            } catch (e) {
                next(e)
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
                console.log(pageConfigurationServiceInstance.getConfig())
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}