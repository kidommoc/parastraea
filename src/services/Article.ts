import { Inject, Service } from 'typedi'
import { Types } from 'mongoose'
import md2h5 from 'md2h5'

@Service()
export class ArticleService {
    @Inject('ArticleModel')
    private articleModel: Models.ArticleModel

    @Inject('AnthologyModel')
    private anthologyModel: Models.AnthologyModel

    constructor () {
    }

    private async checkTitle(title: string): Promise<boolean> {
        let count = await this.articleModel.count({
            title: title
        })
        if (count == 0)
            return true
        return false
    }

    private parseContent(rawText: string) {
        let properties = new Types.Map<string>,
            html = ''
        let tagReg = /^@@[A-za-z\-]+@@$/m,
            valueReg = /^.*$/m

        let result = tagReg.exec(rawText)

        while (result) {
            let tag = result[0].slice(2, -2)
            if (tag == 'content') {
                html = md2h5(rawText.slice(result.index + result[0].length + 1))
                break
            }
            let value = valueReg.exec(rawText.slice(result.index + result[0].length + 1))
            if (!value)
                break
            properties.set(tag, value[0])
            rawText = rawText.slice(result.index + result[0].length + value.index + value[0].length + 2)
            result = tagReg.exec(rawText)
        }

        return {
            properties: properties,
            html: html
        }
    }

    public async getArticleRawText(title: string) {
        let article = await this.articleModel.findOne({
            title: title
        }).select({
            anthology: 1, content: 1, date: 1
        }).lean()
        if (!article) 
            throw new Error('No article with this title!')

        return {
            content: article.content,
            anthology: article.anthology,
            date: article.date.getTime()
        }
    }

    public async getArticleContent(title: string) {
        let article = await this.articleModel.findOne({
            title: title
        }).select({
            html: 1, properties: 1, date: 1
        }).lean()
        if (!article) 
            throw new Error('No article with this title!')

        return {
            html: article.html,
            properties: article.properties,
            date: article.date.getTime()
        }
    }

    public async createArticle(title: string, anthology: string, content: string) {
        if (!await this.checkTitle(title))
            throw new Error('Dumplicate name!')
        let anthologyDocument = await this.anthologyModel.findOne({
            name: anthology
        })
        if (!anthologyDocument)
            throw new Error('No anthology with this name!')
        let parsed = this.parseContent(content)
        let articleDocument = new this.articleModel({
            title: title,
            anthology: anthologyDocument._id,
            content: content,
            html: parsed.html,
            properties: parsed.properties
        })
        ++anthologyDocument.size
        // will use transaction in future
        await articleDocument.save()
        await anthologyDocument.save()
    }

    public async editArticle(title: string, newTitle: string, content: string) {
        if (!await this.checkTitle(newTitle))
            throw new Error('Dumplicate name!')
        let parsed = this.parseContent(content)
        let queryResult = await this.articleModel.find({
            title: title
        })
        if (queryResult.length == 0)
            throw new Error('No article with this name!')
        let articleDocument = queryResult[0]
        articleDocument.title = newTitle
        articleDocument.content = content
        articleDocument.html = parsed.html
        articleDocument.properties = parsed.properties
        await articleDocument.save()
    }

    public async changeAnthology(title: string, anthology: string) {
        let articleDocument = await this.articleModel.findOne({
            title: title
        })
        if (!articleDocument)
            throw new Error('No article with this title!')
        let oldAnthology = await this.anthologyModel
            .findById(articleDocument.anthology)
        let newAnthology = await this.anthologyModel.findOne({
            name: anthology
        })
        if (!newAnthology)
            throw new Error('No anthology with this name!')
        // will use transaction in future
        articleDocument.anthology = newAnthology._id
        --oldAnthology.size
        ++newAnthology.size
        await articleDocument.save()
        await oldAnthology.save()
        await newAnthology.save()
    }

    public async removeArticle(title: string) {
        let articleDocument = await this.articleModel.findOne({
            title: title
        })
        if (articleDocument) {
            let anthologyDocument = await this.anthologyModel
                .findById(articleDocument.anthology)
            --anthologyDocument.size
            await anthologyDocument.save()
        }
        await this.articleModel.deleteOne({
            title: title
        })
    }
}