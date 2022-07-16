import { Inject, Service } from 'typedi'
import { Types } from 'mongoose'

@Service()
export class ArticleService {
    @Inject('ArticleModel')
    private articleModel: Models.ArticleModel

    @Inject('AnthologyModel')
    private anthologyModel: Models.AnthologyModel

    constructor () {
    }

    private async checkTitle(title: string): Promise<boolean> {
        let queryResult = await this.articleModel.find({
            title: title
        }).lean()
        if (queryResult.length != 0)
            return false
        return true
    }

    private parseContent(content: string) {
        let properties: Types.Map<string>,
            html = ''
        return {
            properties: properties,
            html: html
        }
    }

    public async getArticleRawText(title: string) {
        let queryResult = await this.articleModel.findOne({
            title: title
        }).lean()
        if (!queryResult) 
            throw new Error('No article with this title!')

        return {
            content: queryResult.content,
            anthology: queryResult.anthology,
            date: queryResult.date.getTime()
        }
    }

    public async getArticleContent(title: string) {
        let queryResult = await this.articleModel.findOne({
            title: title
        }).lean()
        if (!queryResult) 
            throw new Error('No article with this title!')

        return {
            html: queryResult.html,
            properties: queryResult.properties,
            date: queryResult.date.getTime()
        }
    }

    public async createArticle(title: string, anthology: string, content: string) {
        if (!await this.checkTitle(title))
            throw new Error('Dumplicate name!')
    }

    public async editArticle(title: string, content: string) {
    }

    public async changeAnthology(title: string, anthology: string) {
        let articleQueryResult = await this.articleModel.findOne({
            title: title
        })
        if (!articleQueryResult)
            throw new Error('No article with this title!')
        let anthologyQueryResult = await this.anthologyModel.findOne({
            name: anthology
        }).lean()
        if (!anthologyQueryResult)
            throw new Error('No anthology with this name!')
        articleQueryResult.anthology = anthologyQueryResult._id
        await articleQueryResult.save()
    }

    public async removeArticle(title: string) {
        await this.articleModel.remove({
            title: title
        })
    }
}