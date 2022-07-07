import dbloader from './db'

export default async (expressApp) => {
    // do something ...
    let models = await dbloader()
}