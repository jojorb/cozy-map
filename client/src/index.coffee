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
# if GET res = null
# then create.homedata with
      #homedata.coordinates: [42, 0]
      #homedata.zoom: 3
      #homzdata.name: Cozy User
# .end (err, res)



placesdata =

    getPlacesData: (callback) ->
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

    render: ->
        div null,
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
