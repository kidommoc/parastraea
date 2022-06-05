export class Page {
    public readonly url: string
    public readonly path: string

    constructor (url: string, path: string) {
        this.url = url
        this.path = path
    }
}

export class ArticlePage extends Page {
    public readonly collection: string

    constructor(url: string, path: string, collection: string) {
        super(url, path)
        this.collection = collection
    }
}

export class ListPage extends Page {
    public readonly collection: string
    public readonly size: number

    constructor(url: string, path: string, collection: string, size: number) {
        super(url, path)
        this.collection = collection
        this.size = size
    }
}

export class Config {
    public readonly port: number
    public readonly entry: string
    public readonly pages: Page[]
    public readonly lists: ListPage[]
    public readonly articles: ArticlePage[]

    constructor(port: number, entry: string = "/",
        pages: Page[], lists: ListPage[], articles: ArticlePage[]
    ) {
        this.port = port
        this.entry = entry
        this.pages = pages
        this.articles = articles
        this.lists = lists
    }
}

export default async (path: string): Promise<Config> => {
    const file = await import(path)
    if (!file.port) {
        // error!
    }
    let pages: Page[] = []
    let listPages: ListPage[] = []
    let articlePages: ArticlePage[] = []
    if (file.pages)
        for (let e of file.pages) {
            /* check url and path
             */
            switch (e.type) {
                case "page": 
                    let p = new Page(e.url, e.path)
                    pages.push(p)
                    break
                case "list":
                    /* check collection and size
                     */
                    let l = new ListPage(e.url, e.path, e.collection, e.size)
                    listPages.push(l)
                    break
                case "article":
                    /* check collection
                     */
                    let a = new ArticlePage(e.url, e.path, e.collection)
                    articlePages.push(a)
                    break
                default:
                    continue
            }
        }
    return new Config(file.port, file.entry, pages, listPages, articlePages)
}