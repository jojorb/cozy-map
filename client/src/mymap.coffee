React = require 'react'
{div, p, a, button, span, input, label, h1} = React.DOM
L = global.L or require('leaflet')
# require 'leaflet/dist/leaflet.css'
L.Icon.Default.imagePath = '/styles/images'



map = L.map 'map',
    center: [38, 0]
    zoom: 3
    doubleClickZoom: false

# coffeelint: disable=max_line_length
OpenStreetMap_France =
  L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
  maxZoom: 19
  attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>')
# coffeelint: enable=max_line_length


Layers = OpenStreetMap_France
.addTo map

markerPosition = [42, 0]
popupContent = 'Are you a Mapper?'

MarkerDefault = L.marker markerPosition
.addTo map
.bindPopup popupContent
.openPopup map


redIcon = L.icon(
    iconUrl: '/styles/images/marker2-icon.png'
    shadowUrl: '/styles/images/marker-shadow.png'
    iconSize: [25, 41]
    iconAnchor: [12, 41]
    popupAnchor: [1, -34]
    shadowSize: [41, 41])


# Module PeaceMarker start
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
                'beau gosse!' + '<br>' +
                '[Lat; Lng](zoom) = [' +
                position.lat.toFixed(4) + '; ' + position.lng.toFixed(4) + ']
                (' + markerzoom + ')')
        marker.setLatLng new L.LatLng(position.lat, position.lng),
            draggable: 'true'
        marker.bindPopup(popupContent).openPopup()
        map.panTo(new L.LatLng(position.lat, position.lng))
        map.addLayer(marker)

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
