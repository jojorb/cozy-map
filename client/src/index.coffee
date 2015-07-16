React = require 'react'
request = require 'superagent'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'



homedata =

    getHomeData: (callback) ->
        request
            .get('/api/homedata')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body

    createHomeData: (homedata, callback) ->
        request
            .post('/api/homedata')
            .send(homedata)
            .end (err, res) ->
                callback err, res.body

    deleteHomeData: (homedata, callback) ->
        request
            .del('/api/homedata/' + homedata.id)
            .end callback

    updateHomeData: (homedata, callback) ->
        request
            .put('/api/homedata' + homedata.id)
            .send(homedata) # to fix
            .end (err, res) ->
                callback err, res.body



placesdata =

    getPlacesData: (callback) ->
        request
            .get('/api/placedata')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body
# to fix
data = {
    getHomeBookmarks: homedata
    getPlacesBookmarks: placesdata
    }



# C'est le composant principal de l'application.
App = React.createClass

    # Ici on assure le rendu de ce composant.
    render: ->
        # Le div est un composant de base du DOM, représenté ici en React.
        div null,
            # Ici c'est un composant spécifique que nous avons créé.
            SideBar
                homedata: @props.homedata
                placesdata: @props.placesdata
            MyMap



# Ici on démarre !
#
# On récupère d'abord la cfg stockées sur le homedata
homedata.getHomeData (err, homeData) ->

    data =
        homedata: homedata,
        placesdata: placesdata,
    React.render(React.createElement(App, data),
        document.getElementById('app'))
