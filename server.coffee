# Americano est la bibliothèque qui va nous permettre de générer le serveur
americano = require 'americano'



port = process.env.PORT or 3000
options =
    name: 'cozy-map'
    dbName: 'cozy-map-db'
    port: process.env.PORT or 9240
    host: process.env.HOST or '127.0.0.1'

americano.start options, (err, app, server) ->
    console.log "server is listening on: http://#{options.host}:#{options.port}"
