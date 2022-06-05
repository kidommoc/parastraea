import { Express } from 'express'
import ConfigLoader from './ConfigLoader'

export default async (expressApp: Express, fn: (e: Express, p: number) => void) => {
    let config = await ConfigLoader(`${process.cwd()}/configuration.json`)

    // do something ...

    fn(expressApp, config.port)
}