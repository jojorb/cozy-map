React = require 'react'
request = require 'superagent'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'



# 'api/configuration'
userConfig =

    getConfig: (callback) ->
      # routes = get: homedata.first
        request
            .get('/api/configuration')
            .set('Accept', 'application/json')
            .end (err, res) ->
                console.log res.body.length
                return callback err if err

                if res.body.length is 0
                    callback err, null
                else
                callback err, res.body[0]


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



# 'api/placesdata'
geoPlaces =

    all: (callback) ->
        request
            .get('/api/placesdata')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body



# data to send to Couch db
# no more: warn - Cozy DB | Warning : cast ignored property 'var'
data = {
    homedata: userConfig
    # placedata: geoPlaces
    }

App = React.createClass

    render: ->
        div null,
            SideBar
                homedata: @props.userConfig
            MyMap



# Start the App !

# userConfig.postConfig data, (err, config) ->
#                      #^why data   ^why config or data?
# userConfig.getConfig (err, res) ->
#     console.log "homedata config err: " + err
# # initApp = ->
#
#     data = {
#         homedata: data,#why data?
#         #placesdata: data
#         }
#     React.render(React.createElement(App, data),
#         document.getElementById('app'))
# initApp()



# # not working well!!!
userConfig.getConfig (err, res) ->
    # if res.body.length == 0
    # TypeError: res is undefined
    if err
    # else if res.body is undefined
        userConfig.postConfig data, (err, config) ->
            data =
                homedata: data,
                # placesdata: data,
            React.render(React.createElement(App, data),
                document.getElementById('app'))

    else
        data =
            homedata: data,
            # placesdata: data,
        React.render(React.createElement(App, data),
            document.getElementById('app'))
