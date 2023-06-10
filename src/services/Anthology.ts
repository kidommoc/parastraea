import { Inject, Service } from 'typedi'

import Errors from '@/Errors'

export enum ErrTypes {
    NO_ANTHOLOGY,
    DUMP_NAME,
    CONTAIN_ARTICLE
}

@Service()
export class AnthologyService {
    @Inject('AnthologyModel')
    private _anthologyModel: Models.AnthologyModel

    @Inject('ArticleModel')
    private _articleModel: Models.ArticleModel

    constructor () {
    }

    private async checkName(name: string): Promise<boolean> {
        let count = await this._anthologyModel.count({
            name: name
        })
        if (count == 0)
            return true
        return false
    }

    public async getList() {
        let anthologies: { name: string, size: number }[] = []
        const anthologyDocs = await this._anthologyModel.find()
            .select({ name: 1, size: 1 }).lean()
        if (!anthologyDocs)
            return anthologies
        for (const e of anthologyDocs)
            anthologies.push({
                name: e.name,
                size: e.size
            })
        return anthologies
    }

    public async getArticles(anthology: string) {
        let articles: {
            title: string,
            date: number
        }[] = []

        const anthologyDoc = await this._anthologyModel.findOne({
            name: anthology
        }).lean()
        if (!anthologyDoc)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')

        const anthologyId = anthologyDoc._id
        const articleDocs = await this._articleModel.find({
            anthology: anthologyId
        }).lean().sort({ date: -1 })

        if(!articleDocs)
            return articles
        for (const a of articleDocs)
            articles.push({
                title: a.title,
                date: a.date.getTime()
            })
        return articles
    }

    public async getArticleProps(anthology: string) {
        const anthologyDoc = await this._anthologyModel.findOne({
            name: anthology
        }).select({ _id: 1 }).lean()
        if (!anthologyDoc)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')

        const anthologyId = anthologyDoc._id
        const articleDocs = await this._articleModel.find({
            anthology: anthologyId
        }).select({ properties: 1, date: 1 }).sort({ date: -1 })

        let articles : { properties: { tag: string, value: string }[], date: Date }[] = []
        for (const a of articleDocs) {
            let properties: { tag: string, value: string }[] = []
            a.properties.forEach((v: string, k: string) => properties.push({
                tag: k, value: v
            }))
            articles.push({
                properties: properties, date: a.date
            })
        }
        return articles
    }

    public async create(name: string) {
        if (!await this.checkName(name))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicated name!')
        let newAnthologyDoc = new this._anthologyModel({
            name: name,
            size: 0
        })
        await newAnthologyDoc.save()
    }

    public async rename(oldName: string, newName: string) {
        if (!await this.checkName(newName))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicated name!')
        let anthologyDoc = await this._anthologyModel.findOne({
            name: oldName
        })
        if (!anthologyDoc)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        anthologyDoc.name = newName
        await anthologyDoc.save()
    }

    public async remove(name: string, forced: boolean) {
        let anthologyDoc = await this._anthologyModel.findOne({
            name: name
        }).lean()
        if (!anthologyDoc)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        let anthologyId = anthologyDoc._id
        let articleCount = await this._articleModel.count({
            anthology: anthologyId
        })
        if (articleCount != 0 && !forced)
            throw new Errors.CodedError(ErrTypes.CONTAIN_ARTICLE, 'There\'re articles in this anthology when force is not specified or false!')
        await this._articleModel.deleteMany({
            anthology: anthologyId
        })
        await this._anthologyModel.findByIdAndDelete(anthologyId)
    }
}