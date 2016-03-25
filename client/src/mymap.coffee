React = require 'react'
{div, p, a, button, span, input, label, h1} = React.DOM
L = global.L or require('leaflet')
backend = require './backend.coffee'
L.Icon.Default.imagePath = '/styles/images'



map = L.map 'map',
    center: [13, -37]
    zoom: 2
    doubleClickZoom: false



OpenStreetMap_France =
  L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
  maxZoom: 19
  attribution:
      '&copy;
      Openstreetmap France | &copy;
      <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>')

OpenStreetMap_HOT =
    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        maxZoom: 19
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">
            OpenStreetMap</a>,
            Tiles courtesy of
            <a href="http://hot.openstreetmap.org/"
            target="_blank">Humanitarian OpenStreetMap Team</a>')

Layers = OpenStreetMap_France
.addTo map



configIcon = L.icon(
    iconUrl: '/styles/images/homemarker.png'
    shadowUrl: '/styles/images/marker-shadow.png'
    iconSize: [25, 41]
    iconAnchor: [12, 41]
    popupAnchor: [1, -34]
    shadowSize: [41, 41])

redIcon = L.icon(
    iconUrl: '/styles/images/marker2-icon.png'
    shadowUrl: '/styles/images/marker-shadow.png'
    iconSize: [25, 41]
    iconAnchor: [12, 41]
    popupAnchor: [1, -34]
    shadowSize: [41, 41])



# Module HomeConfig
markerPosition = [13, -37]

configmarker = L.marker markerPosition,
    icon: configIcon
    draggable:'true'
    opacity: '0.98'
configmarker.addTo map


# http://leafletjs.com/examples/layers-control.html
HomeView = L.layerGroup(configmarker)

baseMaps =
    'OSM France': OpenStreetMap_France
    'OSM HOT': OpenStreetMap_HOT

overlayMaps =
    'Home View': HomeView

L.control.layers(baseMaps, overlayMaps).addTo(map)


# Definition du contenu de la popup.
popupContent = """
Set this place as the "Home" view!<br>
Or... drag me where you want to!<br>
Check your preferences to show me or not!<br>
<br>

[Lat; Lng](zoom) = [
<span id="home-popup-lat"></span>;
<span id="home-popup-lng"></span>]
(<span id="home-popup-zoom"></span>) <br>
<input type="hidden" ref="latInput" value="configposition.lat">
<input type="hidden" ref="lngInput" value="configposition.lng">
<input type="hidden" ref="zoomInput" value="configmarkerzoom">
<input type="submit" value="save it!" id="save-home-button">
"""
# On lie la popup au contenu
popup = configmarker.bindPopup(popupContent)



showPopup = ->

    # On montre la popup pour qu'elle soit dans le DOM et rendre ses éléments
    # accessibles.
    popup.openPopup()

    # Récupération des parametres courants.
    configmarkerzoom = map.getZoom()
    configposition = configmarker.getLatLng()
    lat = configposition.lat.toFixed(4)
    lng = configposition.lng.toFixed(4)
    zoom = configmarkerzoom

    # Récupération des éléments à modifier.
    latLabel = document.getElementById('home-popup-lat')
    lngLabel = document.getElementById('home-popup-lng')
    zoomLabel = document.getElementById('home-popup-zoom')

    # Modification des éléments.
    latLabel.innerHTML = lat
    lngLabel.innerHTML = lng
    zoomLabel.innerHTML = zoom

    # Sauvegarde des données sur le click du bouton save it.
    document.getElementById('save-home-button').onclick = ->

        homedata =
            lat: lat
            lng: lng
            zoom: zoom

        backend.putConfigid homedata, ->
            console.log "data saved"


# On attache notre fonction de génération de popup aux evenements de drag and
# drop et de click.
configmarker.on 'dragend', showPopup
configmarker.on 'click', showPopup
# End Module HomeConfig



# Module PeaceMarker
map.on 'dblclick', (event) ->

    marker = new L.marker event.latlng,
        icon: redIcon
        draggable:'true'
        opacity: '0.65'
    marker.addTo map

    marker.on 'dragend', (event) ->
        marker = event.target
        markerzoom = map.getZoom()
        position = marker.getLatLng()
        popupContent = L.popup()
            .setContent(
                '<form class="placemarker-form">' +
                '<img class="input-group">
                <input type="text" name="bookmark-name" ' +
                'placeholder="Bookmark name"
                class="placemarker-form-input" value="">' +
                '<input type="hidden"
                class="placemarker-form-id" value="id">' +
                '<button type="submit" class="placemarker-form-submit">' +
                '+</button></div>' +

                '<div class="placemarker-form-coords">
                [Lat; Lng](zoom) = [' +
                position.lat.toFixed(4) + '; ' +
                position.lng.toFixed(4) + '](' +
                markerzoom + ')</div></form>' +

                '<form class="placemarker-form">' +
                '<div class="input-group">
                <input type="text" name="past-position" ' +
                'placeholder="[Lat; Lng](zoom)"
                class="placemarker-form-input" value="">' +
                '<input type="hidden"
                class="placemarker-form-id" value="goto">' +
                '<button type="submit" class="placemarker-form-submit">' +
                '@</button></div></form>'
                )

        marker.setLatLng new L.LatLng(position.lat, position.lng),
            draggable: 'true'
        marker.bindPopup(popupContent).openPopup()
        map.panTo(new L.LatLng(position.lat, position.lng))
        map.addLayer(marker)
# End Module PeaceMarker



# React wrapper for our leaflet widget.
module.exports =

    # Deplace la carte aux coordonnées données avec le niveaux de zoom donné.
    goToPoint: (lat, lng, zoom) ->
        map.setView L.latLng(lat, lng), zoom
        map.setZoom zoom

    # Déplace le marker de la home aux coordonnées données.
    moveHomeMarker: (lat, lng) ->
        configmarker.setLatLng L.latLng(lat, lng)

    # Ajoute un marker sur la carte aux coordonnées données.
    addMarker: (lat, long) ->
        marker = new L.marker event.latlng,
            icon: redIcon
            draggable:'true'
            opacity: '0.65'
        marker.addTo map
