
# It's just a route to describe the current API. Usually it's the place to give
# the version of the API.
module.exports =
    indexhome: (req, res) ->
        res.send 'beta Config GeoBookmarks API'
    indexpeace: (req, res) ->
        res.send 'beta Feed GeoBookmarks API'
