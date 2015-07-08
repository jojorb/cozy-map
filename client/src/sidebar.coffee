React = require 'react'
{div, p, a, button, input, label, h1, h2, br, span, i} = React.DOM



module.exports = SideBar = React.createFactory React.createClass

    render: ->
        div className: 'sidebar',
            div className: 'search', 'search'
            input {
                id: "mainsearch", className: 'isearch',
                type: 'text', placeholder: 'search for address on map...'}
            div className: 'heading', 'My Places'
            BookmarkList
                bookmarks: @props.bookmarks


# Le composant liste de bookmark.
BookmarkList = React.createFactory React.createClass
    # On définit l'état initial du composant bookmarks, cela est utile pour le
    # rendu dynamique. En effet on lui indique par cet état la liste des
    # bookmarks à afficher. Il suffira de changer cette liste pour que le rendu
    # se déclenche et que l'écran soit mis à jour en fonction.
    getInitialState: ->
        return {
            bookmarks: @props.bookmarks
        }

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
# coffeelint: disable=max_line_length
        while (index < bookmarks.length and bookmarks[index].link isnt line.link)
            index++
# coffeelint: enable=max_line_length
        if (index < bookmarks.length)
            bookmark = bookmarks.splice(index, 1)[0]

            # Changement d'état.
            @setState bookmarks: bookmarks
            # Requête au serveur.
            data.deleteBookmark bookmark, ->
    # Rendu du composant.
    render: ->

        div id: "bookmark-list", className: 'listings',
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
