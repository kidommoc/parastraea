# Parastraea

一个博客框架，支持高度自由的页面模板。在用 Parastraea 框架搭建的博客中，用户的 *文章* 将被组织成 *文集*。文章应当使用 *Markdown* 写作，并会用[这个库](https://github.com/kidommoc/md2h5)翻译成 html。

Parastraea 还提供了一个用于博客管理的页面（`your.blog.site/manage`，请不要占用这个url），因此无需与命令行或是项目中繁复的文件打交道。

## 页面结构

Parastraea 用模板来生成博客页面。这个框架下有3类页面：*通常页面*、*文章页面* 和 *文章列表页面*。用户可以自由地指定页面相关的url、html文件或是其他属性。可以在项目根目录下的 `page.json` （`page.json.example` 给出了一个示例）里更改这些内容，或是在管理页面中修改。

*通常页面* 就如同html文件里呈现的一般，也就是说，Parastraea 不会对这些页面进行任何修改。而对 *文章页面* 和 *文章列表页面* 来说，Parastraea 会把他们的html文件视为页面模板，并在运行中据此生成实际的页面。参考 **模板化页面** 章节以了解更多页面模板相关的内容。

*文章页面* 是如其名一样展示用户文章的页面，而 *文章列表页面* 呈现一个文集的列表。任何 *列表页面* 都应该指定对应的文集，此类模板也和 *文章页面* 稍有不同。

## 模板化页面

在 *文章页面* 中，Parastraea 仅仅是简单地将页面中的 *标签* 替换成对应的 *值*，这些对应关系应当以文本形式与文章一并提交。

模板机制很简单，举个例子，原始文本如果是这样的：

```markdown
@@title@@             --这是标签
示例标题               --这是值，请注意并不存在注释

@@author@@
kidommoc

其他的标签-值 ...

@@content@@
你用 *markdown* 写成的长——长的文章
```

这是对应的html模板：

```html
<header>
    <title>@@title@@</title>
</header>
<body>
    <h1>@@title@@</h1>
    <div>@@content@@</div>
</body>
```

那么 Parastraea 就会生成一个这样的页面：

```html
<header>
    <title>示例文章</title>
</header>
<body>
    <h1>示例文章</h1>
    <div>
        <p class="markdown">你用 <em class="markdown">markdown</em> 写成的长——长的文章</p>
    </div>
</body>
```

值得注意的是，*文章编辑页* 中的 `title` 一项，只影响文章页面的地址。如果要在页面中使用“标题”，应当以“标签-值”的形式在文章文本中指定。

此外，用 *markdown* 写成的正文内容是用[这个库](https://github.com/kidommoc/md2h5)翻译成html的。为了能写出精美的页面模板，建议查看这个repo的README以了解翻译规则。

在 *列表页面* 中，应当有一个作为列表的 `div` 并带有 `id="parastraea-list"` 属性。这个 `div` 的第一个子标签将作为列表项的模板。在列表项模板中，可以调用在文章文本中指定的标签-值。如果列表 `div` 有指定 `size` 属性，通过url实现的列表分页将被启用。

一个列表html模板可能是这样的：

 ```html
 <body>
    其他内容……
    <div id="parastraea-list" size=2>
        <div>
            <h2>@@title@@</h2>
            <p>作者: @@author@@</p>
        </div>
    </div>
    其他内容……
</body>
 ```

那么比如说，假如这个列表的url是 `my.blog.site/blogs`，访问 `my.blog.site/blogs/1` 或者 `my.blog.site/blogs` 将会得到：

 ```html
 <body>
    其他内容……
    <div id="parastraea-list" size=2>
        <div>
            <h2>示例标题3</h2>
            <p>作者: kidommoc</p>
        </div>
        <div>
            <h2>一篇其他文章</h2>
            <p>作者: faith</p>
        </div>
    </div>
    其他内容……
</body>
 ```

而访问 `my.blog.site/blogs/2` 的话:

 ```html
 <body>
    其他内容……
    <div id="parastraea-list" size=2>
        <div>
            <h2>示例标题2</h2>
            <p>作者: kidommoc</p>
        </div>
        <div>
            <h2>示例标题1</h2>
            <p>作者: kidommoc</p>
        </div>
    </div>
    其他内容……
</body>
 ```

是的，默认情况下列表将是降序的。如果想要升序的列表，请在列表 `div` 上指定一个 `ascending=true` 属性。

## 配置

配置文件都放置在项目根目录下，包括一个 `.env` 文件和上文提到的 `page.json` 文件。Parastraea 将使用 `.env` 文件来进行运行环境配置。查看对应的 `.example` 文件以获取更多详细信息。非常推荐复制一份 `.env.example` 文件并修改，以免遗漏重要的配置项。

第一次运行 `Parastraea` 的时候，应当进行 *管理员注册*。此时直接访问管理页会自动跳转到管理员注册页面。 **只有在从未注册过时才可以进行注册**。此后若想要重新注册（修改管理员密码），可以删除项目根目录下的 `.secret` 文件，并重新进入管理页。