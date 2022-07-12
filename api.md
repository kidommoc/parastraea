# API Reference

## Authorization

Login: `POST /api/login`

Logout: `POST /api/logout`

## Page Configuration

Get Configuration: `GET /api/pages`

Modify Configuration: `POST /api/pages`

## Anthology

Get Articles in Anthology: `GET /api/anthology/list`

New Anthology: `PUT /api/anthology`

Rename Anthology: `POST /api/anthology/:name`

Remove Anthology: `DELETE /api/anthology/:name`

## Article

Get Article Details: `GET /api/article/:title`

New Article: `PUT /api/article`

Edit Article: `POST /api/article/:title`

Remove Articles: `DELETE /api/articles`

Change Anthology of Articles: `POST /api/articles/anthology`