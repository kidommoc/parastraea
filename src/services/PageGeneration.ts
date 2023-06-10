import { Inject, Service } from 'typedi'
import * as htmlParser from 'node-html-parser'
import fs from 'node:fs'

import { AnthologyService } from '@/services/Anthology'
import { ArticleService } from '@/services/Article'

export function htmlCharCoding(s: string) {
    s.replace('&', '&amp;')
    s.replace('<', '&lt;')
    s.replace('>', '&gt;')
    s.replace('\'', '&apos;')
    s.replace('"', '&quot;')
    return s
}

@Service()
export class PageGenerationService {
    @Inject()
    private _articleInst: ArticleService
    @Inject()
    private _anthologyInst: AnthologyService

    constructor () { }

    // path: path of page template
    public async generateList(anthology: string, path: string, page: number): Promise<string> {
        let rawText = fs.readFileSync(path, { encoding: 'utf-8' })
        let root = htmlParser.parse(rawText)
        root.removeWhitespace()

        // find list item template
        let list = root.querySelector('#parastraea-list')
        let template = list.firstChild.toString()
        list.removeChild(list.firstChild)

        const articles = await this._anthologyInst.getArticleProps(anthology)
        const size = Number(list.attributes['size'])
        const length = size && size < articles.length ? size : articles.length
        const start = page * length >= articles.length ? articles.length % length : page * length
        for (let i = start; i < start + length; ++i) {
            const article = articles[i]
            let item = template
            const date = new Date(article.date).toLocaleDateString()
            item = item.replace('@@date@@', htmlCharCoding(date))
            for (const p of article.properties)
                item = item.replace(`@@${p.tag}@@`, htmlCharCoding(p.value))
            list.appendChild(htmlParser.parse(item))
        }
        return root.outerHTML
    }

    // path: path of page template
    public async generateArticle(title: string, path: string): Promise<string> {
        let raw = fs.readFileSync(path, { encoding: 'utf-8' })
        let root = htmlParser.parse(raw)
        root.removeWhitespace()
        raw = root.toString()

        const article = await this._articleInst.getContent(title)
        raw = raw.replace('@@content@@', article.html)
        raw = raw.replace('@@date@@', htmlCharCoding(new Date(article.date).toLocaleString()))
        for (const p of article.properties)
            raw = raw.replace(`@@${p.tag}@@`, htmlCharCoding(p.value))
        return raw
    }
}