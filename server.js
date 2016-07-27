var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Play = require('./models/play');
var Movie = require('./models/movie');

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

var router = require('./routes')(app, Play, Movie);

app.get('/', function(req,res){
  var str = "<div style='white-space: pre'>";
  str += 'This is Cinema DB Server Default Page';
  str += '\n\n[ENDPOINT]\n';
  str += '\n/movies (전체 영화 조회)';
  str += '\n/plays (전체 상영시간표 조회)';
  str += '\n/plays/title/:title (상영시간표 제목 검색)';
  str += '\n/plays/day/:day (상영시간표 날짜 검색)';
  str += '\n/plays/theater/:theater (상영시간표 영화관 검색)';
  str += '\n/plays/brand/:brand (상영시간표 영화관브랜드 검색)';
  str += '\n/plays/title&day/:title/:day (상영시간표 제목&날짜 검색)';
  str += '\n/plays/brand&day/:brand/:day (상영시간표 영화관브랜드&날짜 검색)';
  str += '\n/plays/brand&title/:brand/:title (상영시간표 영화관브랜드&제목 검색)';
  res.send(str);
});

var server = app.listen(port, function(){
	console.log("Express server has started on port " + port)
});
