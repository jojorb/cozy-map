React = require 'react'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
map = require './mymap.coffee'
# API CONFIGURATION -> backended ->
#homedata: @props.homedata
#peacemarker: @props.peacemarker
backend = require './backend.coffee'



App = React.createClass

    render: ->
        div null,
            SideBar
                homedata: @props.homedata
                peacemarker: @props.peacemarker



backend.getConfig (err, config) ->

    # backend.getPlaces (err, places) ->

    data =
        homedata: config
        # peacemarker: places

    map.goToPoint config.lat, config.lng, config.zoom
    map.moveHomeMarker config.lat, config.lng

    React.render(React.createElement(App, data),
                 document.getElementById('app'))
