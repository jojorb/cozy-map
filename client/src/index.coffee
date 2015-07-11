React = require 'react'
request = require 'superagent'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'

# Utilitaires pour requêter notre serveur.
homedata =

    # Avec cette fonction, on récupère le home.geojson
    getHomeData: (callback) ->
        request
            .get('/api/homedata')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body

placesdata =

    # Avec cette fonction, on récupère le places.geojson
    getPlacesBookmarks: (callback) ->
        request
            .get('/api/placedata')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body

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
                bookmarks: @props.bookmarks
        # div id: "map", className: 'map', (trying to avoid map in
        # index.html and in CSS)


# Ici on démarre !
#
# On récupère d'abord les bookmarks stockées sur le home.geoJson
homedata.getHomeData (err, homeData) ->

    data =
        homedata: homedata,
        placesdata: placesdata,
        bookmarks: []
    React.render(React.createElement(App, data),
        document.getElementById('app'))

