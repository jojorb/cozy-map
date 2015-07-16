base = require './base'
homedata = require './homedata'


module.exports =

    'api':
        get: base.indexhome
    'api/homedata':
        get: homedata.all
        post: homedata.create
        # put: homedata.update
    'api/homedata/:id':
        # put: homedata.update
        delete: homedata.delete
