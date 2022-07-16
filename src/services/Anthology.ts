import { Inject, Service } from 'typedi'

@Service()
export class AnthologyService {
    @Inject('AnthologyModel')
    private anthologyModel: Models.AnthologyModel

    @Inject('ArticleModel')
    private articleModel: Models.ArticleModel

    constructor () {
    }

    private async checkName(name: string): Promise<boolean> {
        let queryResult = await this.anthologyModel.find({
            name: name
        }).lean()
        if (queryResult.length != 0)
            return false
        return true
    }

    public async getAnthologyList() {
        let anthologies: { name: string, size: number }[] = []
        let queryResult = await this.anthologyModel.find()
            .select({ name: 1, size: 1 }).lean()
        if (!queryResult)
            return anthologies
        queryResult.forEach(e => anthologies.push({
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
            throw new Error('No anthology with this name!')

        let anthologyId = anthologyDocument._id
        let queryResult = await this.articleModel.find({
            anthology: anthologyId
        }).lean().sort({ date: -1 })

        queryResult.forEach(a => {
            articles.push({
                title: a.title,
                date: a.date.getTime()
            })
        })
        return articles
    }

    public async createAnthology(name: string) {
        if (!await this.checkName(name))
            throw new Error('Dumplicated name!')
        let newAnthology = new this.anthologyModel({
            name: name,
            size: 0
        })
        await newAnthology.save()
    }

    public async renameAnthology(oldName: string, newName: string) {
        if (!await this.checkName(newName))
            throw new Error('Dumplicated name!')
        let queryResult = await this.anthologyModel.findOne({
            name: oldName
        })
        if (!queryResult)
            throw new Error('No anthology with this name!')
        queryResult.name = newName
        await queryResult.save()
    }

    public async removeAnthology(name: string, forced: boolean) {
    }
}