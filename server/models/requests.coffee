cozydb = require 'cozy-db-pouchdb'

module.exports =

    homedata:
        all: cozydb.defaultRequests.all
