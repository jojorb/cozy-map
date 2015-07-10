cozydb = require 'cozy-db-pouchdb'


# On décrit le modèle des données que l'on persistera et requêtera.
# Ici c'est notr objet bookmark constitué de deux champs : le titre et le lien
# de la bookmark.
module.exports = Homedata = cozydb.getModel 'Homedata',
    title: type: String
    coordinates: type: [Number, Number]
    zoom: type: Number
    show_pin_point: type: String
