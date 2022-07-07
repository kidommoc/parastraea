import dbLoader from './db'
import injectorLoader from './injector'

export default async (expressApp) => {
    // do something ...
    let models = await dbLoader()
    injectorLoader(models)
}