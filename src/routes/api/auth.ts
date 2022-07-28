import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import config from '@/config'
import { AuthorizationService } from '@/services/Authorization'

export default (): Router => {
    let app = Router()
    let authorizationServiceInstance = Container.get(AuthorizationService)

    // Login: `POST /api/signup`
    app.post('/signup',
        (req: Request, res: Response, next: NextFunction) => {
            // log
            let passwordHashed = req.body.password
            try{
                authorizationServiceInstance.signup(passwordHashed)
                res.status(200).send()
            } catch (e) {
                next(e)
            }
        }
    )

    // Login: `POST /api/login`
    app.post('/login',
        (req: Request, res: Response, next: NextFunction) => {
            // log
            let passwordHashed = req.body.password
            try {
                let token = authorizationServiceInstance.login(passwordHashed)
                let result = {
                    token: token
                }
                res.status(200).send(result)
            } catch (e) {
                next(e)
            }
        }
    )

    return app
}