import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import Errors from '@/Errors'
import { ErrTypes as AuthorizationErrs, AuthorizationService } from '@/services/Authorization'

export default (): Router => {
    let app = Router()
    let authorizationServiceInstance = Container.get(AuthorizationService)

    // Login: `POST /api/signup`
    app.post('/signup',
        (req: Request, res: Response, next: NextFunction) => {
            // log
            let passwordHashed = req.body.password
            try {
                authorizationServiceInstance.signup(passwordHashed)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AuthorizationErrs.SIGNUP_FAIL:
                            res.status(499)
                            break
                        default:
                            res.status(400)
                    }
                }
                else
                    res.status(500)
                next(new Error(e.message))
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
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AuthorizationErrs.AUTH_FAIL:
                            res.status(401)
                            break
                        case AuthorizationErrs.NO_ADMIN:
                            res.status(499)
                            break
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