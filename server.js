var express = require('express');
var cors = require('cors');
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

/*
var corsOptions = {
  origin: '52.26.85.179'
};
app.use(cors(corsOptions));
*/

app.use(cors());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = require('./routes')(app, Play);

app.get('/', function(req,res){
  res.send('This is Cinema DB Server Default Page');
});

var server = app.listen(port, function(){
	console.log("Express server has started on port " + port)
});
