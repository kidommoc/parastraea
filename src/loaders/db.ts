import mongoose from 'mongoose'

import config from '@/config'
import { Article } from '@/models/Article'
import { Anthology } from '@/models/Anthology'

export default async () => {
    try {
        let connection = await mongoose.connect(config.mongodbUri)
        let models = []
        models.push({
            name: 'ArticleModel',
            model: Article(connection)
        })
        models.push({
            name: 'AnthologyModel',
            model: Anthology(connection)
        })
        return models
    } catch (e) {
        throw new Error(`Failed to connect to mongodb! Errmsg:\n${e.toString()}`)
    }
}