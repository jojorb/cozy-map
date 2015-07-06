React = require 'react'
request = require 'superagent'
{div, p, a, button, input, label} = React.DOM

SideBar = require './sidebar.coffee'
MyMap = require './mymap.coffee'

# Utilitaires pour requêter notre serveur.
data =

    # Avec cette fonction, on récupère les bookmarks depuis le serveur.
    getBookmarks: (callback) ->
        request
            .get('/api/bookmarks')
            .set('Accept', 'application/json')
            .end (err, res) ->
                callback err, res.body


    # On demande au serveur de créer une bookmark.
    createBookmark: (bookmark, callback) ->
        request
            .post('/api/bookmarks')
            .send(bookmark)
            .end (err, res) ->
                callback err, res.body

    # On demande au serveur de supprimer une bookmark.
    deleteBookmark: (bookmark, callback) ->
        request
            .del('/api/bookmarks/' + bookmark.id)
            .end callback


# C'est le composant principal de l'application.
App = React.createClass

    # Ici on assure le rendu de ce composant.
    render: ->
        # Le div est un composant de base du DOM, représenté ici en React.
        div null,
            # Ici c'est un composant spécifique que nous avons créé.
            SideBar
                bookmarks: @props.bookmarks
        # div id: "map", className: 'map',
            MyMap



# Ici on démarre !
#
# On récupère d'abord les bookmarks stockées sur le serveur.
data.getBookmarks (err, bookmarks) ->
    console.log bookmarks

    if not bookmarks?
        alert "Je n'ai pas réussi à récupérer les bookmarks"

    else
        # Attention le premier élément de react ne doit pas être attaché
        # directement à l'élément body.
        React.render(React.createElement(App , bookmarks: bookmarks),
                     document.getElementById('app'))
