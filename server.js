
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

/*
    Configuration section.
*/
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('client'));


/*
    Define routes and their handler.
*/
// var indexController = require('./server/controllers/index');
// app.use(indexController);
//
// var debtController = require('./server/controllers/new');
// app.use(newController);


/*
    Start the HTTP server.
*/
var server = app.listen(9250, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Cozy-Map at http://%s:%s', host, port);
});
