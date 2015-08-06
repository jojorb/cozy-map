React = require 'react'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'
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
            MyMap



backend.getConfig (err, config) ->

    # backend.getPlaces (err, places) ->

    data =
        homedata: config
        # peacemarker: places

    React.render(React.createElement(App, data),
                 document.getElementById('app'))
