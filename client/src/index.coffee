React = require 'react'
request = require 'superagent'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'



configuration =

    first: (callback) ->
        request
            .get('/api/configuration')
            .set('Accept', 'application/json')
            .end (err, res) ->
                return callback err if err

                if res.body.length is 0
                    callback err, null
                else
                    callback err, res.body[0]

    create: (data, callback) ->
        request
            .post('/api/configuration')
            .send(data)
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body[0]

    update: (data, callback) ->
        request
            .put("/api/configuration/#{data.id}")
            .send(data)
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body

    delete: (callback) ->
        request
            .delete("/api/configuration/#{data.id}")
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body



placesdata =

    getPlacesData: (callback) ->
        request
            .get('/api/placedata')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body



data = {
    homedata: configuration
    # getPlacesBookmarks: placesdata
    }



# C'est le composant principal de l'application.
App = React.createClass

    render: ->
        div null,
            SideBar
                homedata: @props.homedata
                placesdata: @props.placesdata
            MyMap



# Ici on démarre !
#
# On récupère d'abord la cfg stockées sur le homedata
configuration.first (err, config) ->

    if not config?

        config =
            lat: 42
            lng: 0
            zoom: 3
            name: "Cozy User"

        configuration.create data, (config) ->
            data =
                homedata: config,
                placesdata: placesdata,
            React.render(React.createElement(App, config),
                document.getElementById('app'))

    else
        data =
            homedata: config,
            placesdata: placesdata,
        React.render(React.createElement(App, config),
            document.getElementById('app'))
