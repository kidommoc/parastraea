import { Inject, Service } from 'typedi'
import { Types } from 'mongoose'
import md2h5 from 'md2h5'

import Errors from '@/Errors'

export enum ErrTypes {
    NO_ARTICLE,
    NO_ANTHOLOGY,
    DUMP_NAME
}

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
        let articleDocument = await this.articleModel.findOne({
            title: title
        }).select({
            anthology: 1, content: 1, date: 1
        }).lean()
        if (!articleDocument)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')

        return {
            content: articleDocument.content,
            anthology: articleDocument.anthology,
            date: articleDocument.date.getTime()
        }
    }

    public async getArticleContent(title: string) {
        let articleDocument = await this.articleModel.findOne({
            title: title
        }).select({
            html: 1, properties: 1, date: 1
        }).lean()
        if (!articleDocument)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')

        return {
            html: articleDocument.html,
            properties: articleDocument.properties,
            date: articleDocument.date.getTime()
        }
    }

    public async createArticle(title: string, anthology: string, content: string) {
        if (!await this.checkTitle(title))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicate name!')
        let anthologyDocument = await this.anthologyModel.findOne({
            name: anthology
        })
        if (!anthologyDocument)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
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
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicate name!')
        let parsed = this.parseContent(content)
        let articleDocument = await this.articleModel.findOne({
            title: title
        })
        if (!articleDocument)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')
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
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')
        let oldAnthologyDocument = await this.anthologyModel
            .findById(articleDocument.anthology)
        let newAnthologyDocument = await this.anthologyModel.findOne({
            name: anthology
        })
        if (!newAnthologyDocument)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        // will use transaction in future
        articleDocument.anthology = newAnthologyDocument._id
        --oldAnthologyDocument.size
        ++newAnthologyDocument.size
        await articleDocument.save()
        await oldAnthologyDocument.save()
        await newAnthologyDocument.save()
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