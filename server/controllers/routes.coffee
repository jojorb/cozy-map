base = require './base'
homedata = require './homedata_controler'


module.exports =

    'api':
        get:    base.indexhome
    'api/configuration':
        get:    homedata.first
        post:   homedata.create
    'api/configuration/:id':
        put:    homedata.update
        delete: homedata.delete

