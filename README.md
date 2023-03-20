# Parastraea

A blog framework, supporting freely page templating. In Parastraea, user's *articles* will be organized into *anthologies*. Articles should be written in *markdown*, which will be translate into *html* by [this library](https://github.com/kidommoc/md2h5).

Parastraea also provides a manage page (`your.blog.site/manage`, please don't use this url for blog pages) for blog managing. There's no need to deal with command line or complicated files in projects.

## Page Structure

Parastraea uses templates to generate blog pages. There're 3 types of page in Parastraea: *normal*, *article*, *list*. User can freely specified url, html file location and other properties of pages. They can be modified in `page.json` file which should be found in project root directory (`page.json.example` gives an example), or in manage page.

*Normal* pages are what it looks like, which says, Parastraea does nothing on them. But in *article* and *list* pages, Parastreae treats html file as template, and generates actural pages on the fly. Looks at **Page Templating** chapter for details about templating.

*Article* pages present user's articles, and *list* pages are anthology lists. Any *list* page should specified an anthology for displaying, and their templates are also a little different from *article* pages.

## Page Templating

In *article* pages, Parastraea simply replaces *tags* with their *values*, which are specified in the raw text user submitted.

For example, the raw text may looks like this:

```markdown
@@title@@             --This is tag, THIS IS NOT A COMMENT
Example Title         --This is value, COMMENT NOT SUPPORTED

@@author@@
kidommoc

other tag-values ...

@@content@@
your long-long article in *markdown*
```

And here is the corresponding html template file (part of):

```html
<header>
    <title>@@title@@</title>
</header>
<body>
    <h1>@@title@@</h1>
    <div>@@content@@</div>
</body>
```

Then Parastraea will generate a page like this:

```html
<header>
    <title>Example Title</title>
</header>
<body>
    <h1>Example Title</h1>
    <div>
        <p class="markdown">your long-long article in <em class="markdown">markdown</em></p>
    </div>
</body>
```

Notice that, the `title` in *Article Edit Page* affects page address only. The "title" displayed article page should be specified by article text.

What's more, content written in *markdown* is translate by [this](https://github.com/kidommoc/md2h5). For convenience of stylized templating, please look at the `README` of this repo for translate rules.

In *list* pages, there should be a list `div` with `id="parastraea-list"`, whose first child will be treated as list item template. Tag - value specified in articles can be referred in item template. If `size` property is specified in list `div`, list paging will be available (through url).

List template html for example (part of):

 ```html
 <body>
    other things ...
    <div id="parastraea-list" size=2>
        <div>
            <h2>@@title@@</h2>
            <p>Author: @@author@@</p>
        </div>
    </div>
    other things ...
</body>
 ```

 So for example, the corresponding url of this page is `my.blog.site/blogs`, visit `my.blog.site/blogs/1` or `my.blog.site/blogs` will be:

 ```html
 <body>
    other things ...
    <div id="parastraea-list" size=2>
        <div>
            <h2>Example Title 3</h2>
            <p>Author: kidommoc</p>
        </div>
        <div>
            <h2>Some other article</h2>
            <p>Author: faith&</p>
        </div>
    </div>
    other things ...
</body>
 ```

And `my.blog.site/blogs/2`:

 ```html
 <body>
    other things ...
    <div id="parastraea-list" size=2>
        <div>
            <h2>Example Title 2</h2>
            <p>Author: kidommoc</p>
        </div>
        <div>
            <h2>Example Title 1</h2>
            <p>Author: kidommoc</p>
        </div>
    </div>
    other things ...
</body>
 ```

 Yep, by default lists are descending. If ascending list is require, property `ascending=true` should be assigned to the list `div`.

## Configuration

Configuration files are located in project root directory, contaning a `.env` and a mentioned-above `page.json`. Parastraea uses `.env` file for environment configuration. Please check `.example`s for details. It's recommended to copy, rename and modify `.env.example` for configurating blamelessly.

*Administrator signup* should be taken at the first time `parastraea` runs. Visit manage page, and a redirection to sign up page will happen. **Only if no signup before would this happend**. Removing the `.secret` file in project root directory makes re-signup (aka password changing) available.
