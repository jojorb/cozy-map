cozydb = require 'cozy-db-pouchdb'


# On décrit le modèle des données que l'on persistera et requêtera.
# Ici c'est notr objet bookmark constitué de deux champs : le titre et le lien
# de la bookmark.
module.exports = Bookmark = cozydb.getModel 'Bookmark',
    title: type: String
    link: type: String
