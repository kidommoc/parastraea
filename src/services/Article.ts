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
    private _articleModel: Models.ArticleModel

    @Inject('AnthologyModel')
    private _anthologyModel: Models.AnthologyModel

    constructor () {
    }

    private async checkTitle(title: string): Promise<boolean> {
        let count = await this._articleModel.count({
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
        const articleDocument = await this._articleModel.findOne({
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
        const articleDocument = await this._articleModel.findOne({
            title: title
        }).select({ html: 1, properties: 1, date: 1 })
        if (!articleDocument)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')
        
        let properties: { tag: string, value: string }[] = []
        articleDocument.properties.forEach((v: string, k: string) => properties.push({
            tag: k, value: v
        }))

        return {
            html: articleDocument.html,
            properties: properties,
            date: articleDocument.date.getTime()
        }
    }

    public async getArticlePropertiesOfAnthology(anthology: string) {
        const anthologyDocument = await this._anthologyModel.findOne({
            name: anthology
        }).select({ _id: 1 }).lean()
        if (!anthologyDocument)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        const anthologyId = anthologyDocument._id
        const articleDocuments = await this._articleModel.find({
            anthology: anthologyId
        }).select({ properties: 1, date: 1 }).sort({ date: -1 })

        let articles : { properties: { tag: string, value: string }[], date: Date }[]= []
        articleDocuments.forEach(a => {
            let properties: { tag: string, value: string }[] = []
            a.properties.forEach((v: string, k: string) => properties.push({
                tag: k, value: v
            }))
            articles.push({
                properties: properties, date: a.date
            })
        })
        return articles
    }

    public async createArticle(title: string, anthology: string, content: string) {
        if (!await this.checkTitle(title))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicate name!')
        const anthologyDocument = await this._anthologyModel.findOne({
            name: anthology
        })
        if (!anthologyDocument)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        let parsed = this.parseContent(content)
        let articleDocument = new this._articleModel({
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
        let articleDocument = await this._articleModel.findOne({
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
        let articleDocument = await this._articleModel.findOne({
            title: title
        })
        if (!articleDocument)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')
        let oldAnthologyDocument = await this._anthologyModel
            .findById(articleDocument.anthology)
        let newAnthologyDocument = await this._anthologyModel.findOne({
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
        let articleDocument = await this._articleModel.findOne({
            title: title
        })
        if (articleDocument) {
            let anthologyDocument = await this._anthologyModel
                .findById(articleDocument.anthology)
            --anthologyDocument.size
            await anthologyDocument.save()
        }
        await this._articleModel.deleteOne({
            title: title
        })
    }
}