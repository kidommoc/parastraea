import {
    Router,
    Request as RQ, Response as RS, NextFunction as NF,
} from 'express'
import { Container } from 'typedi'

import Errors from '@/Errors'
import {
    AuthorizationService,
    ErrTypes as AuthErrs,
} from '@/services/Authorization'

export default (): Router => {
    let app = Router()
    let authInst = Container.get(AuthorizationService)

    // Login: `POST /api/signup`
    app.post('/signup',
        (req: RQ, res: RS, next: NF) => {
            // log
            let passwordHashed = req.body.password
            try {
                authInst.signup(passwordHashed)
                res.status(200).send()
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AuthErrs.SIGNUP_FAIL:
                            res.status(499)
                            break
                        default:
                            res.status(400)
                    }
                }
                else
                    res.status(500)
                next(e)
            }
        }
    )

    // Login: `POST /api/login`
    app.post('/login',
        (req: RQ, res: RS, next: NF) => {
            // log
            let passwordHashed = req.body.password
            try {
                let token = authInst.login(passwordHashed)
                let result = {
                    token: token
                }
                res.status(200).send(result)
            } catch (e) {
                if (e instanceof Errors.CodedError) {
                    switch (e.code) {
                        case AuthErrs.AUTH_FAIL:
                            res.status(401)
                            break
                        case AuthErrs.NO_ADMIN:
                            res.status(499)
                            break
                        default:
                            res.status(400)
                            break
                    }
                }
                else
                    res.status(500)
                next(e)
            }
        }
    )

    return app
}