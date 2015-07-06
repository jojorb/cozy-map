# Dépendances nécessaires
path = require 'path'
americano = require 'americano'
path = require 'path'

# Ici construit le chemin ou se trouver les fichiers statiques qu'on veut
# servir.
# Les fichiers statiques sont notammeent le client qui sera chargé dans le
# navigateur (code, styles, fonts et images).
staticPath = path.resolve(path.join __dirname, '..', 'client', 'public')

config =
    common:
        use: [
            # Ce sont des plugins standards, ils permettent de gérer proprement
            # les requêtes constitués de JSON.
            #
            americano.bodyParser()
            americano.methodOverride()
            # Ici on indique qu'il faut servir les fichiers du dossier statique
            # à la racine l'API.
            americano.static staticPath,
                maxAge: 86400000
        ]
        useAfter: [
            americano.errorHandler
                dumpExceptions: true
                showStack: true
        ]

    development: [
        americano.logger 'dev'
    ]

    production: [
        americano.logger 'short'
    ]

    plugins: [
        # Le plugin qui va nous permettre d'utiliser PouchDB simplement.
        'cozy-db-pouchdb'
    ]

module.exports = config
