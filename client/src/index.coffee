React = require 'react'
{div, p, a} = React.DOM
SideBar = require './sidebar.coffee'
map = require './mymap.coffee'
backend = require './backend.coffee'



App = React.createClass

    render: ->
        div null,
            SideBar
                homedata: @props.homedata
                peacemarker: @props.peacemarker



backend.getConfig (err, config) ->

    data =
        homedata: config

    map.goToPoint config.lat, config.lng, config.zoom
    map.moveHomeMarker config.lat, config.lng

    React.render(React.createElement(App, data),
                 document.getElementById('app'))
