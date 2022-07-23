# API Reference

## Authorization

- Login: `POST /api/login`

```
[HEADER] Content-Type: application/json
[BODY]
{
    "password": string
}

--- RETURN ---

SUCCESS: STATUS 200
[BODY]
{
    "token": string (in jwt)
}

FAILED: STATUS 401 - Authorization failed
```

- Logout: `POST /api/logout`

```
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
```

## Page Configuration

- Get Configuration: `GET /api/pages`

```
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
[BODY]
{
    "page-config": string (in json)
}

FAILED: STATUS 401 - Authorization failed
```

- Modify Configuration: `POST /api/pages`

```
[HEADER] Content-Type: application/json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "page-config": string (in json)
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
```

## Anthology

- Get Anthology list: `GET /api/anthology/list`

```
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
[BODY]
{
    "anthologies": [
        {
            "name": string,
            "size": number
        }, ...
    ]
}

FAILED: STATUS 401 - Authorization failed
```

- Get Articles in Anthology: `GET /api/anthology/:name/list`

```
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
[BODY]
{
    "articles": [
        {
            "title": string,
            "date": number (in milliseconds)
        }, ...
    ]
}

FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No anthology with this name
```

- New Anthology: `PUT /api/anthology`

```
[HEADER] Content-Type: application/json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "name": string
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - Dumplicate name
```

- Rename Anthology: `POST /api/anthology/:name`

```
[HEADER] Content-Type: application/json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "new-name": string
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No anthology with this name
FAILED: STATUS 498 - Dumplicate name
```

- Remove Anthology: `DELETE /api/anthology/:name`

```
[HEADER] Content-Type: application/json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "force"?: true
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No anthology with this name
FAILED: STATUS 498 - There're articles in this anthology when `force` is not specified or `false`
```

## Article

- Get Article Details: `GET /api/article/:title`

```
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
[BODY]
{
    "content": string,
    "anthology": string
}

FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this title
```

- New Article: `PUT /api/article`

```
[HEADER] Content-Type: application/json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "title": string,
    "anthology": string,
    "content": string
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - Dumplicate name
FAILED: STATUS 498 - No anthology with this name
```

- Edit Article: `POST /api/article/:title`

```
[HEADER] Content-Type: application/json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "new-title": string,
    "new-content": string
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this name
```

- Change Anthology of Article: `POST /api/article/:title/anthology`

```
[HEADER] Content-Type: application/json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "new-anthology": string
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this title
FAILED: STATUS 498 - No anthology with this name
```

- Remove Article: `DELETE /api/article/:title`

```
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this title
```