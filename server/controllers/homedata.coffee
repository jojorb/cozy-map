Homedata = require '../models/homedata'


module.exports =

    # Ce contrôleur va requêter la base de données pour obtenir toutes les
    # bookmarks pour ensuite les envoyer dans la réponse.
    all: (req, res, next) ->
        Homedata.all (err, homedata) ->
            next err if err

            res.send homedata


    # Ce contrôleur va prendre les informations de la requête pour créer une
    # nouvelle bookmark dans la base de données. Une fois que la bookmark a été
    # créée, on la renvoie car elle contient maintenant son identifiant en base
    # de données. Ce qui sera utile au client pour faire d'autres opérations
    # sur la bookmark.
    create: (req, res, next) ->
        homedata = req.body

        if not homedata.title? or not homedata.coordinates? or not homedata.zoom?
            res.status(400).send msg: 'home malformed.'

        else
            Homedata.create homedata, (err, homedataModel) ->

                if err
                    console.log err
                    res.status(500).send msg: err

                else
                    res.send homedataModel


    # Ici le client indique via l'url sur laquelle il envoie une requête
    # l'identifiant du bookmark à supprimer.
    # Ensuite le contrôleur va supprimer le bookmark et indiquer dans la
    # réponse que tout s'est bien passé.
    delete: (req, res, next) ->

        Homedata.find req.params.id, (err, homedata) ->

            if err
                console.log err
                res.status(500).send msg: err

            else if not homedata?
                res.status(404).send msg: 'Home does not exist.'

            else
                # Suppression du bookmarkument.
                homedata.destroy (err) ->
                    if err
                        console.log err
                        res.status(500).send msg: err
                    else
                        res.sendStatus 204
