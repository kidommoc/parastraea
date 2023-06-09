import { Service } from 'typedi'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import config from '@/config'
import Errors from '@/Errors'

export enum ErrTypes {
    SIGNUP_FAIL,
    AUTH_FAIL,
    NO_ADMIN
}

@Service()
export class AuthorizationService {
    private _jwtSecret: string
    private _passwordPath: string

    constructor() {
        this._jwtSecret = crypto.createHmac('sha256', new Date().getTime().toString())
            .update(config.secretText).digest('hex')
        this._passwordPath = path.join(config.rootPath, './.secret')
    }

    public signup(p: string) {
        if (fs.existsSync(this._passwordPath))
            throw new Errors.CodedError(ErrTypes.SIGNUP_FAIL, 'Cannot sign up!')
        else {
            let doubleHashed = crypto.createHmac('sha256', config.secretText)
                .update(p).digest('hex')
            try {
                fs.writeFileSync(this._passwordPath, doubleHashed)
            } catch (e) {
                throw new Error(e)
            }
        }
    }

    public login(p: string): string {
        let password: string
        try {
            password = fs.readFileSync(this._passwordPath, { encoding: 'utf-8' })
        } catch (e) {
            throw new Errors.CodedError(ErrTypes.NO_ADMIN, 'No administrator!')
        }
        // hash secret string
        let hashed = crypto.createHmac('sha256', config.secretText)
            .update(p).digest('hex')
        if (hashed != password)
            throw new Errors.CodedError(ErrTypes.AUTH_FAIL, 'Authorization failed!')
        // generate auth token for return
        let token = jwt.sign(
            { hello: 'thanks for using Parastraea!' },
            this._jwtSecret,
            { expiresIn: 300, algorithm: 'HS256' }
        )
        return token
    }

    public verify(token: string): string {
        try {
            jwt.verify(token, this._jwtSecret, { algorithms: ['HS256'] })
            let newToken = jwt.sign(
                { hello: 'thanks for using Parastraea!' },
                this._jwtSecret,
                { expiresIn: 300, algorithm: 'HS256' }
            )
            return newToken
        } catch (e) {
            throw new Errors.CodedError(ErrTypes.AUTH_FAIL, 'Authorization failed!')
        }
    }
}