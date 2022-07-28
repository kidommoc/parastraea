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
    private anthologyModel: Models.AnthologyModel

    @Inject('ArticleModel')
    private articleModel: Models.ArticleModel

    constructor () {
    }

    private async checkName(name: string): Promise<boolean> {
        let count = await this.anthologyModel.count({
            name: name
        })
        if (count == 0)
            return true
        return false
    }

    public async getAnthologyList() {
        let anthologies: { name: string, size: number }[] = []
        let anthologyDocuments = await this.anthologyModel.find()
            .select({ name: 1, size: 1 }).lean()
        if (!anthologyDocuments)
            return anthologies
        anthologyDocuments.forEach(e => anthologies.push({
            name: e.name,
            size: e.size
        }))
        return anthologies
    }

    public async getArticleList(anthologyName: string) {
        let articles: {
            title: string,
            date: number
        }[] = []

        let anthologyDocument = await this.anthologyModel.findOne({
            name: anthologyName
        }).lean()
        if (!anthologyDocument)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')

        let anthologyId = anthologyDocument._id
        let articleDocuments = await this.articleModel.find({
            anthology: anthologyId
        }).lean().sort({ date: -1 })

        if(!articleDocuments)
            return articles
        articleDocuments.forEach(a => {
            articles.push({
                title: a.title,
                date: a.date.getTime()
            })
        })
        return articles
    }

    public async createAnthology(name: string) {
        if (!await this.checkName(name))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicated name!')
        let newAnthologyDocument = new this.anthologyModel({
            name: name,
            size: 0
        })
        await newAnthologyDocument.save()
    }

    public async renameAnthology(oldName: string, newName: string) {
        if (!await this.checkName(newName))
            throw new Errors.CodedError(ErrTypes.DUMP_NAME, 'Dumplicated name!')
        let anthologyDocument = await this.anthologyModel.findOne({
            name: oldName
        })
        if (!anthologyDocument)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        anthologyDocument.name = newName
        await anthologyDocument.save()
    }

    public async removeAnthology(name: string, forced: boolean) {
        let anthologyDocument = await this.anthologyModel.findOne({
            name: name
        }).lean()
        if (!anthologyDocument)
            throw new Errors.CodedError(ErrTypes.NO_ANTHOLOGY, 'No anthology with this name!')
        let anthologyId = anthologyDocument._id
        let articleCount = await this.articleModel.count({
            anthology: anthologyId
        })
        if (articleCount != 0 && !forced)
            throw new Errors.CodedError(ErrTypes.CONTAIN_ARTICLE, 'There\'re articles in this anthology when force is not specified or false!')
        await this.articleModel.deleteMany({
            anthology: anthologyId
        })
        await this.anthologyModel.findByIdAndDelete(anthologyId)
    }
}