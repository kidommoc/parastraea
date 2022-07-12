import { Service } from 'typedi'

@Service()
export class PageGenerator {
    public generateList(anthology: string, path: string): string {
        return JSON.stringify({
            anthology: anthology, path: path
        })
    }

    public generateArticle(title: string, anthology: string, path: string): string {
        return JSON.stringify({
            title: title, anthology: anthology, path: path
        })
    }
}