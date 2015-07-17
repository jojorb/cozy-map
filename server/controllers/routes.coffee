base = require './base'
homedata = require './homedata'


module.exports =

    'api':
        get: base.indexhome
    'api/configuration':
        get: homedata.all
        post: homedata.create
        # put: homedata.update
    'api/configuration/:id':
        # put: homedata.update
        delete: homedata.delete
