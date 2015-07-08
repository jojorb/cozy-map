React = require 'react'
{div, p, a, button, span, input, label, h1} = React.DOM
L = require 'leaflet'
L.Icon.Default.imagePath = '/styles/images'
{homegeojsonDir} = '/cozymap-leaflet/leaflet.homegeojson.js'


map = L.map 'map',
    center: [38, 0]
    zoom: 2
    doubleClickZoom: false
    # homegeojsonDir: '/geojsondata/home.geojson'


# coffeelint: disable=max_line_length
tiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
maxZoom = 19
# coffeelint: enable=max_line_length
Layers = L.tileLayer tiles,
    attribution: attribution
    maxZoom: maxZoom
.addTo map


markerPosition = [42, 0]
popupContent = 'Are you a Mapper?'

MarkerDefault = L.marker markerPosition
.addTo map
.bindPopup popupContent
.openPopup map
