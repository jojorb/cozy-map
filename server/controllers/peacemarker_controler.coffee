Peacemarker = require '../models/peacemarker_model'

module.exports =


    all: (req, res, next) ->
        Peacemarker.all (err, peacemarker) ->
            if err
                res.status(500).send({error: "An error has occured -- #{err}"})
            else
                res.send peacemarker



    create: (req, res, next) ->
        peacemarker = req.body

        if not peacemarker? or not peacemarker.lat? or not peacemarker.lng?
            res.status(400).send msg: 'Place Marker malformed.'

        else
            Peacemarker.create peacemarker, (err, peacemarker) ->

                if err
                    console.log err
                    res.status(500).send msg: err

                else
                    res.send peacemarker



    update: (req, res, next) ->
        id = req.params.id

        Peacemarker.find id, (err, peacemarker) ->
            return next err if err

            peacemarker.updateAttributes req.body, (err, peacemarker) ->
                return next err if err

                res.send peacemarker


    delete: (req, res, next) ->

        Peacemarker.find req.params.id, (err, peacemarker) ->

            if err
                console.log err
                res.status(500).send msg: err

            else if not peacemarker?
                res.status(404).send msg: 'peacemarker does not exist.'

            else
                peacemarker.destroy (err) ->
                    if err
                        console.log err
                        res.status(500).send msg: err
                    else
                        res.sendStatus 204
