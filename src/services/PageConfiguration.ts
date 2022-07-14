import { Service } from 'typedi'
import fs from 'fs'
import path from 'path'

import config from '@/config'

@Service()
export class PageConfigurationService {
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

    public loadConfig() {
        try {
            const text = fs.readFileSync(this._path, 'utf8')
            this.updateConfig(text)
        } catch (e) {
            throw new Error(`cannott load page config!\nErrmsg: ${e}`)
        }
    }

    public saveConfig() {
        try {
            fs.writeFileSync(this._path, this.toString())
        } catch (e) {
            throw new Error(`cannot store new page config!\nErrmsg: ${e}`)
        }
    }

    public toString(): string {
        // construct json
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

        // format json string
        let jsonString = JSON.stringify(json),
            pos = 0, depth = 0
        while (pos < jsonString.length) {
            if (jsonString[pos] == ':') {
                jsonString = jsonString.slice(0, pos + 1) + ' '
                    + jsonString.slice(pos + 1, jsonString.length)
                pos += 2
                continue
            }
            if ('{[,'.includes(jsonString[pos])) {
                if ('{['.includes(jsonString[pos]))
                    ++depth
                let insert = '\n'
                for (let i = 0; i < depth; ++i)
                    insert += '    '
                jsonString = jsonString.slice(0, pos + 1) + insert
                    + jsonString.slice(pos + 1, jsonString.length)
                pos += depth * 4 + 1
            }
            if ('}]'.includes(jsonString[pos])) {
                --depth
                let insert = '\n'
                for (let i = 0; i < depth; ++i)
                    insert += '    '
                jsonString = jsonString.slice(0, pos) + insert
                    + jsonString.slice(pos, jsonString.length)
                pos += depth * 4 + 1
            }
            ++pos
        }

        return jsonString
    }
}