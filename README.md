# Parastraea

A blog framework.

## Configuration

```json
{
    "port": 8080,
    "entry": "/blog",
    "pages": [
        {
            "url": "/blog",
            "path": "/public/bloglist.html",
            "type": "list",
            "collection": "blog",
            "size": 15
        },
        {
            "url": "/blog/:articleId",
            "path": "/public/blog.html",
            "type": "article",
            "collection": "blog"
        },
        {
            "url": "/about",
            "path": "/public/about.html",
            "type": "page"
        }
    ]
}
```

- `port`: specify the port server start at
- `entry` (optional): specify which url to jump when directly visit
- `pages`: list of page specifications.

There are 3 types of page: *normal page*, *collection list page* and *article page*. All of them require `url`, `path` and `type` specification. `url` indicates the url to visit this page and `path` specifies the path to its html file. Well the `type`, an enum of `page`, `list` and `article`, indicates page type of normal page, collection list page and article page respectively. Both list and article require `collection` specification indicating which collection to use. What's more, the length of list in one page can be indicated by an optional specification `size`.