React = require 'react'
{div, p, a, button, input, label, h1, h2, br, span, i} = React.DOM



module.exports = SideBar = React.createFactory React.createClass

    render: ->
        div id: "sidebar", className: 'sidebar',
            div id: "sidebar-search", className: 'search', 'search'
            input {
                id: "sidebar-search-input", className: 'isearch',
                type: 'text', placeholder: 'search for address on map...'}
            div id: "sidebar-heading", className: 'heading', 'My Places'
            BookmarkList
                homedata: @props.homedata
                placesdata: @props.placesdata
                bookmarks: @props.bookmarks



SearchPlaces = React.createFactory React.createClass

    getInitialState: ->
        return null

    render: ->
        return



# Le composant liste de bookmark.
BookmarkList = React.createFactory React.createClass
    # On définit l'état initial du composant bookmarks, cela est utile pour le
    # rendu dynamique. En effet on lui indique par cet état la liste des
    # bookmarks à afficher. Il suffira de changer cette liste pour que le rendu
    # se déclenche et que l'écran soit mis à jour en fonction.
    getInitialState: ->
        return {
            homedata: @props.homedata
            placesdata: @props.placesdata
            bookmarks: @props.bookmarks
        }
        @getHomeBookmarkComponents()
        @getPlacesBookmarkComponents()

    # Cette fonction renvoie à la liste home bookmark qu'on veut générer.
    getHomeBookmarkComponents: ->
        homebookmarkComponents = []
        for homedata in @state.homedata
            homebookmarkComponents = HomeBookmarkComponent
                hcoordinates: homedata.features[0].geometry.coordinates
                hlng: homedata.features[0].geometry.coordinates[0]
                hlat: homedata.features[0].geometry.coordinates[1]
                hzoom: homedata.features[0].properties.zoom
                htitle: homedata.features[0].properties.title
                hname: homedata.features[0].properties.name
            homebookmarkComponents.push homebookmarkComponent
            return homebookmarkComponents



    # Cette fonction renvoie à la liste places bookmark qu'on veut générer.
    getPlacesBookmarkComponents: ->
        placesbookmarkComponents = []
        for placesdata in @state.placesdata
            placesbookmarkComponents = PlacesBookmarkComponent
                pcoordinates: placesdata.features[0].geometry.coordinates
                plng: placesdata.features[0].geometry.coordinates[0]
                plat: placesdata.features[0].geometry.coordinates[1]
                pzoom: placesdata.features[0].properties.zoom
                ptitle: placesdata.features[0].properties.title
                paddress: placesdata.features[0].properties.address
                ppostalCode: placesdata.features[0].properties.postalCode
                pcity: placesdata.features[0].properties.city
                pstate: placesdata.features[0].properties.state
                pcountry: placesdata.features[0].properties.country
                pphone: placesdata.features[0].properties.phone
                pemail: placesdata.features[0].properties.email
                pwebsite: placesdata.features[0].properties.website
                ptag: placesdata.features[0].properties.tag
            placesdatabookmarkComponents.push placesdatabookmarkComponent
            return placesdatabookmarkComponents



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



# Le composant qui va définir une ligne de homedata.
homedata = React.createFactory React.createClass

    render: ->
        div id: 'sidebar-home',
            div id: 'sidebar-home-item', className: 'item',
                p {className: "title"},
                    "#{@state.title}"
                    br null, null
                span {className: "mygps"},
                    "Lat: #{@state.hlat} Lng: #{@state.hlng}"

# Le composant qui va définir une ligne de placesdata.
placesdata = React.createFactory React.createClass

    render: ->
        div id: 'sidebar-places',
            div id: 'sidebar-places-item', className: 'item',
                p {className: "title"},
                    "#{@state.title}"
                    br null, null
                span {className: "mygps"},
                    "Lat: #{@state.ilat} Lng: #{@state.ilng}"
                    br null, null
                span className: 'irl',
                    "#{@state.address} "
                    "#{@state.postalCode} "
                    "#{@state.city}, "
                    "#{@state.state} "
                    "#{@state.zip} "
                    "#{@state.country}"

                    div id: 'infow',
                p {className: 'kontact'},
                # coffeelint: disable=max_line_length
                    a href: @state.website, target: '_blank', @state.website + ' '
                    a href: "mailto:@state.email", target: '_top', @state.email + ' '
                    a href: "callto:@state.phone", target: '_top', @state.phone
                    # coffeelint: enable=max_line_length
                span {className: 'tag'},
                    "TAG: #{@state.tag}"



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
