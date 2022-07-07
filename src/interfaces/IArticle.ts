import { Types } from 'mongoose'

export interface IArticle {
    title: string
    anthology: Types.ObjectId
    content: string
    html: string
    date: Date
    author?: string
    intro?: string
}