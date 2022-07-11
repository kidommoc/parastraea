export function generateList(anthology: string, path: string): string {
    return JSON.stringify({
        anthology: anthology, path: path
    })
}

export function generateArticle(title: string, anthology: string, path: string): string {
    return JSON.stringify({
        title: title, anthology: anthology, path: path
    })
}