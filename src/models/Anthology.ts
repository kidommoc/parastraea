import { Schema, Model } from 'mongoose'
import { IAnthology } from '@/interfaces/IAnthology'

const anthologySchema = new Schema<IAnthology>({
    name: { type: String, required: true },
    size: { type: Number, required: true, default: 0 }
})

const Anthology = (mongoose): Models.AnthologyModel => mongoose.model('anthologies', anthologySchema)

export { Anthology }