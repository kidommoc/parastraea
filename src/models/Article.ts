import { Schema, Model, Types } from 'mongoose'

interface IArticle {
    title: string
    anthology: Types.ObjectId
    content: string
    html: string
    date: Date
    author?: string
    intro?: string
}

const articleSchema = new Schema<IArticle> ({
    title: { type: String, required: true },
    anthology: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    html: { type: String, required: true },
    date: { type: Date, required: true, default: new Date() },
    author: String,
    intro: String,
})

const Article = (mongoose): Model<IArticle> => mongoose.model('articles', articleSchema)

export { Article }