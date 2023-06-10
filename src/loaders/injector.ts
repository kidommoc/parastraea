import { Container } from 'typedi'
import express from 'express'

export default (app: express.Application, models: { name: string, model }[]) => {
    try {
        Container.set('ExpressApp', app)
        for (const m of models) {
            Container.set(m.name, m.model)
        }
        // more injection ...
    } catch (e) {
        throw new Error(`Failed to inject!\nErrmsg:${e.toString()}`)
    }
}