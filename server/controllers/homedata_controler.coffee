HomedataModel = require '../models/homedata_model'


module.exports =

    first: (req, res, next) ->
        HomedataModel.first (err, homedata) ->
            if err
                res.status(500).send msg: err

            else if err
                res.status(400).send {msg: "An error has occured -- #{err}"}

            else
                res.send homedata



    all: (req, res, next) ->
        HomedataModel.all (err, homedata) ->
            next err if err

            res.send homedata



    create: (req, res, next) ->
        HomedataModel.create (err, homedata) ->
            if err
                res.status(500).send msg: err

            else
                res.send homedata



    update: (req, res, next) ->
        id = req.params.id

        HomedataModel.find id, (err, homedata) ->
            return next err if err

            homedata.updateAttributes req.body, (err, homedata) ->
                return next err if err

                res.send homedata



    delete: (req, res, next) ->

        HomedataModel.find req.params.id, (err, homedata) ->

            if err
                console.log err
                res.status(500).send msg: err

            else if not homedata?
                res.status(404).send msg: 'Home does not exist.'

            else
                homedata.destroy (err) ->
                    if err
                        console.log err
                        res.status(500).send msg: err
                    else
                        res.sendStatus 204
