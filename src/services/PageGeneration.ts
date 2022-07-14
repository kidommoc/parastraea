import { Service } from 'typedi'

@Service()
export class PageGenerationService {
    public async generateList(anthology: string, path: string): Promise<string> {
        return JSON.stringify({
            anthology: anthology, path: path
        })
    }

    public async generateArticle(title: string, anthology: string, path: string): Promise<string> {
        return JSON.stringify({
            title: title, anthology: anthology, path: path
        })
    }
}