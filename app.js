var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var movie = require('./models/movie');

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

var port = 8080;
//var port = process.env.PORT || 8080;

var router = require('./routes')(app, movie);

var server = app.listen(port, function(){
	console.log("Express server has started on port " + port)
});

var Movie = require('./models/movie');
