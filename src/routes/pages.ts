import { Router } from 'express'
import { Container } from 'typedi'
import path from 'path'

import config from '@/config'
import { PageConfigurator } from '@/services/PageConfig'
import { generateArticle, generateList } from '@/services/PageGenerator'

export default () => {
    let app = Router()
    let pageConfig = Container.get(PageConfigurator)

    pageConfig.getConfig().pages.forEach(p => {
        app.get(p.url, async (req, res) =>
            //res.sendFile(path.join(config.rootPath, '/public', p.location))
            res.send(path.join(config.rootPath, '/public', p.location))
        )
        // log
    })

    pageConfig.getConfig().lists.forEach(p => {
        app.get(p.url, async (req, res) =>
            res.send(generateList(p.anthology, p.location))
        )
        // log
    })

    pageConfig.getConfig().articles.forEach(p => {
        app.get(p.url, async (req, res) =>
            res.send(generateArticle(req.params.title, p.anthology, p.location))
        )
        // log
    })

    return app
}