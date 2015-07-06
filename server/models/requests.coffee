cozydb = require 'cozy-db-pouchdb'

# Avec PouchDB, on décrit à l'avance les requêtes que l'on va utiliser.
module.exports =
    bookmark:
        all: cozydb.defaultRequests.all

