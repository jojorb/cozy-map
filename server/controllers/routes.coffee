base = require './base'
homedata = require './homedata'


module.exports =

    'api':
        get: base.indexhome
    'api/homedata':
        get: homedata.all
        post: homedata.create
    'api/homedata/:id':
        delete: homedata.delete
