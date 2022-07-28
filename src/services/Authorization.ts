import { Service } from 'typedi'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import config from '@/config'

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
        console.log(this._passwordPath)
        if (fs.existsSync(this._passwordPath))
            throw new Error('Cannot sign up!')
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
            throw new Error('No administrator!')
        }
        let hashed = crypto.createHmac('sha256', config.secretText)
            .update(p).digest('hex')
        if (hashed != password)
            throw new Error('Authorization failed!')
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
            throw new Error('Authorization failed!')
        }
    }
}