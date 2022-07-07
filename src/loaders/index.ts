import dbLoader from './db'
import injectorLoader from './injector'
import expressLoader from './express'

export default async (expressApp) => {
    // do something ...
    let models = await dbLoader()
    injectorLoader(models)
    expressLoader(expressApp)
}