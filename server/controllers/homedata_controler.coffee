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


    create: (req, res, next) ->
        HomedataModel.create req.body, (err, homedata) ->
            if err
                res.status(500).send msg: err

            else
                res.send homedata


    update: (req, res, next) ->

        HomedataModel.first (err, homedata) ->

            if err
                console.log err
                res.status(500).send msg: err

            else if not homedata?
                res.status(404).send msg: 'Home does not exist.'

            else
                homedata.updateAttributes req.body, (err, homedata) ->
                    return next err if err

                    res.send homedata


    delete: (req, res, next) ->

        HomedataModel.first (err, homedata) ->

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

