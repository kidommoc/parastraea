import { Service } from 'typedi'
import fs from 'fs'
import path from 'path'

import config from '@/config'

@Service()
export class PageConfigurator {
    private _path: string;
    private _config: {
        entry: string
        pages: {
            url: string,
            location: string,
        }[]
        lists: {
            url: string,
            location: string,
            anthology: string
        }[]
        articles: {
            url: string,
            location: string,
            anthology: string
        }[]
    }

    constructor() {
        this._path = path.join(config.rootPath, '/pages.json')
        this.loadConfig()
    }

    public getConfig() {
        return this._config
    }

    public updateConfig(text: string) {
        const json = JSON.parse(text)
        this._config = {
            entry: json.homepage || '/',
            pages: [], lists: [], articles: []
        }
        json.pages.forEach(p => {
            if (p.url && p.location) {
                switch (p.type) {
                    case 'list':
                        if (p.anthology)
                            this._config.lists.push({
                                url: p.url,
                                location: p.location,
                                anthology: p.anthology
                            })
                        else {
                            // log
                        }
                        break;
                    case 'article':
                        if (p.anthology && p.url.includes('/:title'))
                            this._config.articles.push({
                                url: p.url,
                                location: p.location,
                                anthology: p.anthology
                            })
                        else {
                            // log
                        }
                        break;
                    case 'page':
                    default:
                        this._config.pages.push({
                            url: p.url,
                            location: p.location
                        })
                        break;
                }
            }
            else {
                //log
            }
        })
    }

    public async loadConfig() {
        try {
            const text = fs.readFileSync(this._path, 'utf8')
            this.updateConfig(text)
        } catch (e) {
            throw new Error(`cannott load page config!\nErrmsg: ${e}`)
        }
    }

    public async saveConfig() {
        try {
            fs.writeFileSync(this._path, this.toString())
        } catch (e) {
            throw new Error(`cannot store new page config!\nErrmsg: ${e}`)
        }
    }

    public toString(): string {
        let json: {
            homepage: string,
            pages: any[]
        } = { homepage: this._config.entry, pages: []}
        this._config.pages.forEach(p => {
            json.pages.push({
                type: "page",
                url: p.url,
                location: p.location
            })
        })
        this._config.lists.forEach(p => {
            json.pages.push({
                type: "list",
                url: p.url,
                location: p.location,
                anthology: p.anthology
            })
        })
        this._config.articles.forEach(p => {
            json.pages.push({
                type: "article",
                url: p.url,
                location: p.location,
                anthology: p.anthology
            })
        })
        return JSON.stringify(json)
    }
}