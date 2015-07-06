
# It's just a route to describe the current API. Usually it's the place to give
# the version of the API.
module.exports =
    index: (req, res) ->
        res.send 'My Bookmarks API'
