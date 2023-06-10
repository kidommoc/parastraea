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

    private parse(rawText: string) {
        let properties = new Types.Map<string>,
            html = ''
        // looks like `@@tag@@`
        let tagReg = /^@@[A-za-z\-]+@@$/m,
        // the next line after tag
            valueReg = /^.*$/m

        let result = tagReg.exec(rawText)

        while (result) {
            // remove '@@'
            let tag = result[0].slice(2, -2)
            
            // have resolved all tags
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

    public async getRaw(title: string) {
        const articleDoc = await this._articleModel.findOne({
            title: title
        }).select({
            anthology: 1, content: 1, date: 1
        }).lean()
        if (!articleDoc)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')

        return {
            content: articleDoc.content,
            anthology: articleDoc.anthology,
            date: articleDoc.date.getTime()
        }
    }

    public async getContent(title: string) {
        const articleDoc = await this._articleModel.findOne({
            title: title
        }).select({ html: 1, properties: 1, date: 1 })
        if (!articleDoc)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')
        
        let properties: { tag: string, value: string }[] = []
        articleDoc.properties.forEach((v: string, k: string) => properties.push({
            tag: k, value: v
        }))

        return {
            html: articleDoc.html,
            properties: properties,
            date: articleDoc.date.getTime()
        }
    }

    public async create(title: string, anthology: string, content: string) {
        if (!await this.checkTitle(title))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicate name!')
        const anthologyDoc = await this._anthologyModel.findOne({
            name: anthology
        })
        if (!anthologyDoc)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        let parsed = this.parse(content)
        let articleDoc = new this._articleModel({
            title: title,
            anthology: anthologyDoc._id,
            content: content,
            html: parsed.html,
            properties: parsed.properties
        })
        ++anthologyDoc.size
        // will use transaction in future
        await articleDoc.save()
        await anthologyDoc.save()
    }

    public async edit(title: string, newTitle: string, content: string) {
        if (!await this.checkTitle(newTitle))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicate name!')
        let parsed = this.parse(content)
        let articleDoc = await this._articleModel.findOne({
            title: title
        })
        if (!articleDoc)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')
        articleDoc.title = newTitle
        articleDoc.content = content
        articleDoc.html = parsed.html
        articleDoc.properties = parsed.properties
        await articleDoc.save()
    }

    public async move(title: string, anthology: string) {
        let articleDoc = await this._articleModel.findOne({
            title: title
        })
        if (!articleDoc)
            throw new Errors.CodedError(ErrTypes.NO_ARTICLE, 'No article with this title!')
        let oldAnthologyDoc = await this._anthologyModel
            .findById(articleDoc.anthology)
        let newAnthologyDoc = await this._anthologyModel.findOne({
            name: anthology
        })
        if (!newAnthologyDoc)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        // will use transaction in future
        articleDoc.anthology = newAnthologyDoc._id
        --oldAnthologyDoc.size
        ++newAnthologyDoc.size
        await articleDoc.save()
        await oldAnthologyDoc.save()
        await newAnthologyDoc.save()
    }

    public async remove(title: string) {
        let articleDoc = await this._articleModel.findOne({
            title: title
        })
        if (articleDoc) {
            let anthologyDoc = await this._anthologyModel
                .findById(articleDoc.anthology)
            --anthologyDoc.size
            await anthologyDoc.save()
        }
        await this._articleModel.deleteOne({
            title: title
        })
    }
}