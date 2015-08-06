base = require './base'
homedata = require './homedata_controler'
peacemarker =require './peacemarker_controler'

module.exports =

    'api':
        get:    base.indexhome
    'api/configuration':
        get:    homedata.first
        post:   homedata.create
    'api/configuration/:id':
        put:    homedata.update
        delete: homedata.delete

    'api':
        get:    base.indexpeace
    'api/peacemarkerapi':
        get:    peacemarker.all
        post:   peacemarker.create
    'api/peacemarkerapi/:id':
        put:    peacemarker.update
        delete: peacemarker.delete
