import { Schema, Model } from 'mongoose'

interface IAnthology {
    name: string
    size: number
}

const anthologySchema = new Schema<IAnthology>({
    name: { type: String, required: true },
    size: { type: Number, required: true, default: 0 }
})

const Anthology = (mongoose): Model<IAnthology> => mongoose.model('anthologies', anthologySchema)

export { Anthology }