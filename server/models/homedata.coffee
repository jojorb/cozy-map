cozydb = require 'cozy-db-pouchdb'



module.exports = Homedata = cozydb.getModel 'Homedata',
    helloworld: String
    name: String
    title: String
    coordinates: [Number]
    zoom: Number
    show_pin_point: Boolean
    placesdata_db: Boolean
    kilometres: Boolean
    miles: Boolean
    celsius: Boolean
    fahrenheit: Boolean
    hectare: Boolean
    acre: Boolean
    here: Boolean
    here_subdomains: Number
    here_mapID: String
    here_app_id: String
    here_app_code: String
    here_base: String
    mapbox: Boolean
    mapbox_subdomains: String
    mapbox_id: String
    mapbox_accessToken: String
