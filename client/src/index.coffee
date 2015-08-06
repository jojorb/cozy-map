React = require 'react'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'
# API CONFIGURATION -> backended -> homedata: @props.homedata
backend = require './backend.coffee'



# 'api/placesdata'
geoPlaces =

    all: (callback) ->
        request
            .get('/api/placesdata')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body



App = React.createClass

    render: ->
        div null,
            SideBar
                homedata: @props.homedata
            MyMap



backend.getConfig (err, config) ->

    data =
        homedata: config

    React.render(React.createElement(App, data),
                 document.getElementById('app'))
