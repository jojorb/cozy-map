React = require 'react'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'
# API CONFIGURATION -> backended -> homedata: @props.homedata
backend = require './backend.coffee'



App = React.createClass

    render: ->
        div null,
            SideBar
                homedata: @props.homedata
            MyMap



backend.getConfig (err, config) ->
    # backend.getPlaces (err, bookmarker) ->

    data =
        homedata: config
        # peacemarker: bookmarker

    React.render(React.createElement(App, data),
                 document.getElementById('app'))
