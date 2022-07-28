import { Model } from 'mongoose'
import { IAnthology } from '@/interfaces/IAnthology'
import { IArticle } from '@/interfaces/IArticle'

declare global {
    namespace Models {
        type AnthologyModel = Model<IAnthology & Document>
        type ArticleModel = Model<IArticle & Document>
    }
}