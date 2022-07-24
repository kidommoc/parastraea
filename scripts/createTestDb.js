const mongoose = require('mongoose')
const md2h5 = require('../dependencies/md2h5')

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    anthology: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    html: { type: String, required: true },
    date: { type: Date, required: true, default: new Date() },
    properties: { type: mongoose.Schema.Types.Map, of: String }
})
const anthologySchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true, default: 0 }
})

const content1 = 
`@@title@@
Example Title 1

@@intro@@
A short introduction of article 1.

@@content@@
# heading 1

[1]: http://link1.com/

paragraph 1. *italic* and **bold** and ***both***

paragraph 2 ends with \`br\`.<br />
so here is next line. visit [here][1] or [here](http://link1.com/ "subtitude title")  
another line?

*paragraph 3.
33333

## heading 2

1. here should be text

    but block can be add here

2. *ordered list*

100. \`will be better\``

const content2 = 
`@@title@@
Example Title 2

@@intro@@
A short introduction of article 2.

@@content@@

\`\`\`javascript
export default (md) => convert(md)
\`\`\`

> let's block quote something
>
> > nest quote!
>
> - try a
> - list here

### heading 3

![img](no.this.link "another title")`

function parseContent(rawText) {
    let properties = []
    let html = ''
    let tagReg = /^@@[A-za-z\-]+@@$/m,
        valueReg = /^.*$/m

    let result = tagReg.exec(rawText)

    while (result) {
        let tag = result[0].slice(2, -2)
        if (tag == 'content') {
            html = md2h5(rawText.slice(result.index + result[0].length + 1))
            break
        }
        let value = valueReg.exec(rawText.slice(result.index + result[0].length + 1))
        if (!value)
            break
        properties.push({ tag: tag, value: value[0]})
        rawText = rawText.slice(result.index + result[0].length + value.index + value[0].length + 2)
        result = tagReg.exec(rawText)
    }

    return {
        properties: properties,
        html: html
    }
}

function delay(n) {
    return new Promise(resolve => setTimeout(resolve, n*1000))
}

async function run() {
    let connection = await mongoose.connect('mongodb://localhost:27017/testblog')
    console.log('===connected to db===')
    let anthologyModel = connection.model('anthologies', anthologySchema)
    let articleModel = connection.model('articles', articleSchema)

    await anthologyModel.deleteMany({})
    await articleModel.deleteMany({})

    let antho1 = {
        name: 'anthology1',
        size: 2
    }
    let anthology1 = new anthologyModel(antho1)
    await anthology1.save()
    console.log('===create anthology1:===')
    console.log(await anthologyModel.findById({ _id: anthology1._id }).lean())

    let parseda1content = parseContent(content1)
    let article1 = new articleModel({
        title: 'article1',
        anthology: anthology1._id,
        content: content1,
        html: parseda1content.html,
        properties: {},
        date: new Date()
    })
    parseda1content.properties.forEach(e => {
        article1.properties.set(e.tag, e.value)
    })
    await article1.save()
    console.log('===created article1:===')
    console.log(await articleModel.findById({ _id: article1._id }).lean())
    console.log(new Date().toUTCString())

    await delay(5)

    let parseda2content = parseContent(content2)
    let article2 = new articleModel({
        title: 'article2',
        anthology: anthology1._id,
        content: content2,
        html: parseda2content.html,
        properties: {},
        date: new Date()
    })
    parseda2content.properties.forEach(e => {
        article2.properties.set(e.tag, e.value)
    })
    await article2.save()
    console.log('===created article2:===')
    console.log(await articleModel.findById({ _id: article2._id }).lean())

    console.log('===check anthologies===')
    console.log(await anthologyModel.find({}).select({ _id: 1, name: 1, size: 1 }).lean())

    console.log('===finished creating test database===')
    process.exit(0)
}

run()