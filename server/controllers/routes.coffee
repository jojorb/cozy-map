base = require './base'
bookmarks = require './bookmarks'


module.exports =
    'api':
        get: base.index
    'api/bookmarks':
        get: bookmarks.all
        post: bookmarks.create
    'api/bookmarks/:id':
        delete: bookmarks.delete

