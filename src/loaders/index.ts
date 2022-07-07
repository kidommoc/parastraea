import dbLoader from './db'

export default async (expressApp) => {
    // do something ...
    let models = await dbLoader()
}