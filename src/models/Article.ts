import { Schema, Model, Types } from 'mongoose'
import { IArticle } from '@/interfaces/IArticle'

const articleSchema = new Schema<IArticle> ({
    title: { type: String, required: true },
    anthology: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    html: { type: String, required: true },
    date: { type: Date, required: true, default: new Date() },
    author: String,
    intro: String,
})

const Article = (mongoose): Models.ArticleModel => mongoose.model('articles', articleSchema)

export { Article }