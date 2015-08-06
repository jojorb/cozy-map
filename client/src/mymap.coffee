React = require 'react'
{div, p, a, button, span, input, label, h1} = React.DOM
L = global.L or require('leaflet')
backend = require './backend.coffee'
# require 'leaflet/dist/leaflet.css'
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

onSvClicked: ->
    lat = @refs.latInput.getDOMNode().value
    lng = @refs.lngInput.getDOMNode().value
    zoom = @refs.zoomInput.getDOMNode().value

    homedata =
        id: @props.homedata.id
        lat: lat
        lng: lng
        zoom: zoom

    backend.putConfigid homedata, ->
        console.log "data saved"

configmarker.on 'dragend', (event) ->
    configmarker = event.target
    configmarkerzoom = map.getZoom()
    configposition = configmarker.getLatLng()

    popupContent = (
        'Set this place as the "Home" view!' + '<br>' +
        'Or... drag me where you want to!' + '<br>' +
        'Check your preferences to show me or not!' + '<br>' +
        '<br>' +

        '[Lat; Lng](zoom) = [' +
        configposition.lat.toFixed(4) + '; ' +
        configposition.lng.toFixed(4) + '](' +
        configmarkerzoom + ')' + '<br>' +

        '<input type="hidden" ref="latInput" value="configposition.lat">' +
        '<input type="hidden" ref="lngInput" value="configposition.lng">' +
        '<input type="hidden" ref="zoomInput" value="configmarkerzoom">' +
        '<input type="submit" value="save it!" onClick="onSvClicked">'
    )
    configmarker.setLatLng new L.LatLng(configposition.lat, configposition.lng),
        draggable: 'true'
    configmarker.bindPopup(popupContent)
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
                '<div class="input-group">
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

    goToPoint: (lat, long) ->

    addMarker: (lat, long) ->
        marker = new L.marker event.latlng,
            icon: redIcon
            draggable:'true'
            opacity: '0.65'
        marker.addTo map
# Module PeaceMarker end



# module.exports = MyMap = React.createFactory React.createClass
#
#     render: ->
#         homedata: @props.homedata
#         console.log @props
