cozydb = require 'cozy-db-pouchdb'

module.exports = HomedataModel = cozydb.getModel 'Homedata',

    helloworld:           type: String,     default: 'Hello!'
    name:                 type: String,     default: 'CozyUser'
    title:                type: String,     default: 'view finder'
    lat:                  type: Number,     default: 42
    lng:                  type: Number,     default: 0
    zoom:                 type: Number,     default: 3
    show_pin_point:       type: Boolean,    default: true
    placesdata_db:        type: Boolean,    default: true
    kilometres:           type: Boolean,    default: true
    miles:                type: Boolean,    default: false
    celsius:              type: Boolean,    default: true
    fahrenheit:           type: Boolean,    default: false
    hectare:              type: Boolean,    default: true
    acre:                 type: Boolean,    default: false
    here:                 type: Boolean,    default: false # extra API
    here_subdomains:      type: Number,     default: 123
    here_mapID:           type: String,     default: 'newest'
    here_app_id:          type: String,     default: '<your app_id>'
    here_app_code:        type: String,     default: '<your app_code>'
    here_base:            type: String,     default: 'base'
    mapbox:               type: Boolean,    default: false # extra API
    mapbox_subdomains:    type: String,     default: 'abcd'
    mapbox_id:            type: String,     default: 'examples.map-i87786ca'
    mapbox_accessToken:   type: String,     default: '<your access token here>'
