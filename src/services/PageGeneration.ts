import { Service } from 'typedi'
import { Inject } from 'typedi'
import * as htmlParser from 'node-html-parser'
import fs from 'node:fs'

import { ArticleService } from '@/services/Article'

@Service()
export class PageGenerationService {
    @Inject()
    private _articleServiceInstance: ArticleService

    constructor () {
    }

    public async generateList(anthology: string, path: string, page: number): Promise<string> {
        let rawText = fs.readFileSync(path, { encoding: 'utf-8' })
        let root = htmlParser.parse(rawText)
        root.removeWhitespace()
        let listNode = root.querySelector('#parastraea-list')
        let itemTemplate = listNode.firstChild.toString()
        listNode.removeChild(listNode.firstChild)

        const articles = await this._articleServiceInstance.getArticlePropertiesOfAnthology(anthology)
        const size = Number(listNode.attributes['size'])
        const length = size && size < articles.length ? size : articles.length
        const start = page * length >= articles.length ? articles.length % length : page * length
        for (let i = start; i < start + length; ++i) {
            const article = articles[i]
            let newText = itemTemplate
            newText = newText.replace('@@date@@', new Date(article.date).toLocaleDateString())
            article.properties.forEach(p => newText = newText.replace(`@@${p.tag}@@`, p.value))
            listNode.appendChild(htmlParser.parse(newText))
        }
        return root.outerHTML
    }

    public async generateArticle(title: string, path: string): Promise<string> {
        let rawText = fs.readFileSync(path, { encoding: 'utf-8' })
        let root = htmlParser.parse(rawText)
        root.removeWhitespace()
        rawText = root.toString()

        const article = await this._articleServiceInstance.getArticleContent(title)
        rawText = rawText.replace('@@content@@', article.html)
        rawText = rawText.replace('@@date@@', new Date(article.date).toLocaleString())
        article.properties.forEach(p => rawText = rawText.replace(`@@${p.tag}@@`, p.value))
        return rawText
    }
}