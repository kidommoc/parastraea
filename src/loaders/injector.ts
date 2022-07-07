import { Container } from 'typedi'

export default (models: { name: string, model }[]) => {
    try {
        models.forEach(m => {
            Container.set(m.name, m.model)
        })
        // more injection ...
    } catch (e) {
        throw new Error(`Failed to inject!\nErrmsg:${e.toString()}`)
    }
}