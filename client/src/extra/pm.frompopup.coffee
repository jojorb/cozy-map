L = global.L or require('leaflet')


# WOP...

    # Quand le bouton ajout est cliqué, on récupère les valeurs des
    # différents champs.
    # Puis on met à jour la liste des composants. Enfin on provoque un nouveau
    # rendu en changeant l'état.
    # Enfin, on envoie une requête de création au serveur.
#     onAddClicked: ->
#         bookmarks = @state.bookmarks
#         title = @refs.titleInput.getDOMNode().value
#         link = @refs.linkInput.getDOMNode().value
#
#         bookmark = title: title, link: link
#         bookmarks.push bookmark
#
#         # Changement d'état.
#         @setState bookmarks: bookmarks
#         # Requête au server.
#         data.createBookmark bookmark, ->

# div null,
#     label null, "title"
#     input
#         ref: "titleInput"
#         type: "text"
# div null,
#     label null, "url"
#     input
#         ref: "linkInput"
#         type: "text"
# div null,
#     button
#         onClick: @onAddClicked
#     , "+"
# div null,


popupContent = L.popup().setContent(
    '<form class="placemarker-form">' +
    '<div class="input-group"><input type="text" name="bookmark-name" ' +
    'placeholder="Bookmark name" class="placemarker-form-input" value="">' +
    '<input type="hidden" class="placemarker-form-id" value="id">' +
    '<button type="submit" class="placemarker-form-submit">' +
    '+</button></div>' +
    '<div class="placemarker-form-coords">[Lat; Lng](zoom) = [' +
    position.lat.toFixed(4) + '; ' + position.lng.toFixed(4) + '](' +
    markerzoom + ')</div></form>' +
    '<form class="placemarker-form">' +
    '<div class="input-group"><input type="text" name="past-position" ' +
    'placeholder="[Lat; Lng](zoom)" class="placemarker-form-input" value="">' +
    '<input type="hidden" class="placemarker-form-id" value="goto">' +
    '<button type="submit" class="placemarker-form-submit">' +
    '@</button></div></form>')
