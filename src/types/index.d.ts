import { Model } from 'mongoose'
import { IAnthology } from '@/interfaces/IAnthology'
import { IArticle } from '@/interfaces/IArticle'

declare global {
    namespace Models {
        export type AnthologyModel = Model<IAnthology & Document>
        export type ArticleModel = Model<IArticle & Document>
    }
}