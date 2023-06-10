import { Inject, Service } from 'typedi'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'

import config from '@/config'

@Service()
export class PageManagementService {
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

    @Inject('ExpressApp')
    private _app: express.Application

    constructor() {
        this._path = path.resolve(config.rootPath, 'pages.json')
        this.load()
    }

    get config() { return this._config }

    public update(text: string) {
        const json = JSON.parse(text)
        this._config = {
            entry: json.homepage || '/',
            pages: [], lists: [], articles: []
        }
        if (!Array.isArray(json.pages)) {
            // error
        }
        for (const p of json.pages) {
            if (typeof p.url != 'string'
                || typeof p.location != 'string'
            )
                continue
            switch (p.type) {
                case 'list':
                    if (typeof p.anthology != 'string')
                        continue
                    this._config.lists.push({
                        url: p.url,
                        location: p.location,
                        anthology: p.anthology,
                    })
                    break
                case 'article':
                    if (typeof p.anthology != 'string')
                        continue
                    this._config.articles.push({
                        url: p.url,
                        location: p.location,
                        anthology: p.anthology,
                    })
                    break
                case 'page':
                    this._config.pages.push({
                        url: p.url,
                        location: p.location,
                    })
                    break
                default:
                    break
            }
        }
        this.save()
    }

    public load() {
        const text = fs.readFileSync(this._path, 'utf8')
        this.update(text)
    }

    public save() {
        fs.writeFileSync(this._path, this.toString())
    }

    public reroute() {
        // copied-pasted code about express dynamic reroute
        let stack = this._app._router.stack
        let foundLayer = stack.find(function(x) { return '/'.match(x.regexp) && x.name == 'router' })
        let index = stack.indexOf(foundLayer instanceof Array ? foundLayer[0] : foundLayer)
        if (index == -1)
            throw new Error('reroute failed')
        const router = require('@/routes')
        this._app._router.stack[Number(index)].handle = router.default()
    }

    public toString() {
        let json: {
            homepage: string,
            pages: any[]
        } = { homepage: this._config.entry, pages: []}
        for (const p of this._config.pages) {
            json.pages.push({
                type: "page",
                url: p.url,
                location: p.location
            })
        }
        for (const p of this._config.lists) {
            json.pages.push({
                type: "list",
                url: p.url,
                location: p.location,
                anthology: p.anthology
            })
        }
        for (const p of this._config.articles) {
            json.pages.push({
                type: "article",
                url: p.url,
                location: p.location,
                anthology: p.anthology
            })
        }
        return json.toString()
    }
}