base = require './base'
bookmarks = require './bookmarks'
# homedata = require '.homedata'


module.exports =
    'api':
        get: base.index
    'api/bookmarks':
        get: bookmarks.all
        post: bookmarks.create
    'api/bookmarks/:id':
        delete: bookmarks.delete

    #Homedata
    # 'api':
    #     get: base.indexhome
    # 'api/homedata':
    #     get: homedata.all
    #     post: homedata.create
    # 'api/Homedata/:id':
    #     delete: Homedata.delete
