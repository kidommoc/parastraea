import {
    Router,
    Request as RQ, Response as RS, NextFunction as NF
} from 'express'
import { Container } from 'typedi'

import middlewares from '@/routes/middlewares'
import Errors from '@/Errors'
import { PageManagementService } from '@/services/PageManagement'

export default (): Router => {
    let app = Router()
    let pageMngInst = Container.get(PageManagementService)

    // Get Configuration: `GET /api/pages`
    app.get('/', middlewares.isAuth, (req: RQ, res: RS, next: NF) => {
        // log
        try {
            const json = pageMngInst.toString()
            res.status(200).send(json)
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

    // Modify Configuration: `POST /api/pages`
    app.post('/', middlewares.isAuth, (req: RQ, res: RS, next: NF) => {
        // log
        let newConfig = req.body['page-config']
        try {
            pageMngInst.update(newConfig)
            pageMngInst.reroute()
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
            next(e)
        }
    })

    return app
}