React = require 'react'
request = require 'superagent'
{div, p, a, button, input, label} = React.DOM


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
            div null, 'My Bookmarks'
            # Ici c'est un composant spécifique que nous avons créé.
            BookmarkList
                bookmarks: @props.bookmarks


# Le composant liste de bookmark.
BookmarkList = React.createFactory React.createClass

    # On définit l'état initial du composant bookmarks, cela est utile pour le
    # rendu dynamique. En effet on lui indique par cet état la liste des
    # bookmarks à afficher. Il suffira de changer cette liste pour que le rendu
    # se déclenche et que l'écran soit mis à jour en fonction.
    getInitialState: ->
        return bookmarks: @props.bookmarks

    # Quand le bouton ajout est cliqué, on récupère les valeurs des
    # différents champs.
    # Puis on met à jour la liste des composants. Enfin on provoque un nouveau
    # rendu en changeant l'état.
    # Enfin, on envoie une requête de création au serveur.
    onAddClicked: ->
        bookmarks = @state.bookmarks
        title = @refs.titleInput.getDOMNode().value
        link = @refs.linkInput.getDOMNode().value

        bookmark = title: title, link: link
        bookmarks.push bookmark

        # Changement d'état.
        @setState bookmarks: bookmarks
        # Requête au server.
        data.createBookmark bookmark, ->

    # Quand on supprime une ligne, on met à jour la liste des lignes. Puis on
    # provoque le rendu du composant en changeant l'état.
    # Enfin on envoie une requête de suppression au serveur.
    removeLine: (line) ->
        bookmarks = @state.bookmarks
        index = 0

        while (index < bookmarks.length and bookmarks[index].link isnt line.link)
            index++

        if (index < bookmarks.length)
            bookmark = bookmarks.splice(index, 1)[0]

            # Changement d'état.
            @setState bookmarks: bookmarks
            # Requête au serveur.
            data.deleteBookmark bookmark, ->

    # Rendu du composant.
    render: ->

        div null,
            div null,
                label null, "title"
                input
                    ref: "titleInput"
                    type: "text"
            div null,
                label null, "url"
                input
                    ref: "linkInput"
                    type: "text"
            div null,
                button
                    onClick: @onAddClicked
                , "+"
            div null,
                # Ici on génère un composant bookmark par bookmark présentes
                # dans la liste. La fonction map permet de constituer un
                # tableau de composant bookmark à partir d'une liste de
                # d'objet bookmark.
                @state.bookmarks.map (bookmark) =>
                    Bookmark
                        title: bookmark.title
                        link: bookmark.link
                        removeLine: @removeLine


# Le composant qui va définir une ligne de bookmark.
Bookmark = React.createFactory React.createClass

    # Quand le bouton supprimé est cliqué, on demande au parent de supprimer la
    # la ligne courante.
    onDeleteClicked: ->
        @props.removeLine @props

    # Rendu de la bookmark, on
    render: ->
        div null,
            p
                className: "title", @props.title
            p
                className: 'link'
            ,
                a
                    href: @props.link
                ,
                    @props.link
            p
                button onClick: @onDeleteClicked, "X"


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
