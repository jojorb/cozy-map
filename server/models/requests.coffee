# See documentation on https://github.com/cozy/cozy-db

cozydb = require 'cozy-db-pouchdb'

module.exports =

    homedata_model:
        all: cozydb.defaultRequests.all

    peacemarker_model:
        all: cozydb.defaultRequests.all
