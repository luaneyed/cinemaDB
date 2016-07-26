var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Play = require('./models/play');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost/cinema');

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

//var port = 8080;
var port = process.env.PORT || 8080;

var router = require('./routes')(app, Play);

app.get('/', function(req,res){
  res.send('This is Cinema DB Server Default Page');
});

var server = app.listen(port, function(){
	console.log("Express server has started on port " + port)
});
