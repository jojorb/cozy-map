cozydb = require 'cozy-db-pouchdb'

module.exports = PeacemarkerModel = cozydb.getModel 'Peacemarker',

    lat:                  type: Number
    lng:                  type: Number
    zoom:                 type: Number
    title:                type: String
    address:              type: String
    postalcode:           type: Number
    city:                 type: String
    state:                type: String
    country:              type: String
    phone:                type: Number
    email:                type: String
    website:              type: String
