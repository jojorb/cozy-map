# Americano est la bibliothèque qui va nous permettre de générer le serveur
# HTTP de notre application. C'est lui qui va nous permettre de construire
# notre API.
americano = require 'americano'


# Ici on donne les options du serveur.
port = process.env.PORT or 3000
options =
    name: 'my-bookmarks'
    dbName: 'my-bookmarks-db'
    # C'est le port que va occuper notre serveur pour communiquer.
    # On pourra aisin se connecter sur le serveur avec l'URL:
    # http://localhost:9104/
    port: process.env.PORT or 9240
    # L'host permet d'autoriser l'accès au serveur dans certaines conditions.
    # Par exemple ici, on veut que le serveur soit accessible que depuis la
    # machine qui le fait tourner (localhost = 127.0.0.1).
    host: process.env.HOST or '127.0.0.1'

americano.start options, (err, app, server) ->
    console.log "server is listening on #{options.port}..."

