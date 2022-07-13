# API Reference

## Authorization

- Login: `POST /api/login`

```json
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

```json
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
```

## Page Configuration

- Get Configuration: `GET /api/pages`

```json
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

```json
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

- Get Articles in Anthology: `GET /api/anthology/:name/list`

```json
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
```

- New Anthology: `PUT /api/anthology`

```json
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

```json
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

```json
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

```json
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
[BODY]
{
    "content": string,
    "anthology": string,
    "date": Date
}

FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this title
```

- New Article: `PUT /api/article`

```json
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
```

- Edit Article: `POST /api/article/:title`

```json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "content": string
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this name
```

- Change Anthology of Article: `POST /api/article/:title/anthology`

```json
[HEADER] Authorization: Bearer <token>
[BODY]
{
    "anthology": string
}

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this title
```

- Remove Article: `DELETE /api/article/:title`

```json
[HEADER] Authorization: Bearer <token>

--- RETURN ---

SUCCESS: STATUS 200
FAILED: STATUS 401 - Authorization failed
FAILED: STATUS 499 - No article with this title
```