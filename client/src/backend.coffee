request = require 'superagent'

# Tools to handle server data.
#
module.exports =

    getConfig: (callback) ->
        # routes = get: homedata.first
        request
            .get('/api/configuration')
            .set('Accept', 'application/json')
            .end (err, res) ->
                return callback err if err

                if res.body.length is 0
                    callback err, null
                else
                    callback err, res.body


    postConfig: (homedata, callback) ->
        # routes = post: homedata.create "with homedata as data"
        request
            .post('/api/configuration')
            .send(homedata)
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body[0]


    putConfigid: (homedata, callback) ->
        # routes = put: homedata.update "for homedata.id as data"
        request
            .put("/api/configuration/#{homedata.id}")
            .send(homedata)
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body


    delConfigid: (callback) ->
        # routes = delete: homedata.delete "for homedata.id as data"
        request
            .delete("/api/configuration/#{homedata.id}")
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body

