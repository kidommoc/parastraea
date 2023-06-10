import { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'

import { AuthorizationService } from '@/services/Authorization'

export default (req: Request, res: Response, next: NextFunction) => {
    let authInst = Container.get(AuthorizationService)
    if (!req.headers.authorization) {
        res.status(401)
        return next(new Error('Authorization failed!'))
    }
    let authHeader = req.headers.authorization.split(' ')
    if (authHeader.length != 2 && authHeader[0] != 'Bearer') {
        res.status(401)
        return next(new Error('Authorization failed!'))
    }
    try {
        let newToken = authInst.verify(authHeader[1])
        res.set('Access-Control-Expose-Headers', 'Authorization')
        res.header('Authorization', newToken)
    } catch (e) {
        res.status(401)
        return next(e)
    }
    next()
}