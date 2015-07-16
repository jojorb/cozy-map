
# testing the POST function of the JSON API
    createHomeData: (homedata, callback) ->
        request
            .post('/api/homedata')      # address
            .send(homedata)             # {body: 'thing'}
            .end (err, res) ->
        # expect(err).to.eql(null);
        # expect(res.body._id).to.not.be.eql(null);
        # expect(res.body.body).to.be.eql('thing');
        # id = res.body._id;
                callback err, res.body



    getHomeData: (callback) ->
        request
            .get('/api/homedata')               # .get('address' + id)
            .set('Accept', 'application/json')
            .end (err, res) ->
        # expect(err).to.eql(null);
        # expect(res.body._id).to.be.eql(id);
        # expect(res.body.body).to.be.eql('thing');
                callback err, res.body



    updateHomeData: (homedata, callback) ->
        request
            .put('/api/homedata' + homedata.id)   # .put('address' + id)
            .send(homedata)                       # {body: 'an updated thing'}
            .end (err, res) ->
        # expect(err).to.eql(null);
        # expect(res.body._id).to.be.eql(id);
        # expect(res.body.body).to.be.eql('an updated thing');
                callback err, res.body



    deleteHomeData: (homedata, callback) ->
        request
            .del('/api/homedata/' + homedata.id)   # .del('address' + id)
            .end callback
