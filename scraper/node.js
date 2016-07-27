const spawn = require('child_process').spawn;
const casperPlay = spawn('casperjs', [__dirname + "/casperPlay.js"]);
var mongoose = require('mongoose');

var leftSave = -1;

var Play = require('../models/play');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log("Scraper connected to mongod server");
});
mongoose.connect('mongodb://localhost/cinema');

var casperData = "";

casperPlay.stdout.on('data', function(data) {
  casperData += data;
  process.stdout.write(data);
  if(data.slice(-1) == '\n')
    updateDB();
    //process.stdout.write(arr);
});

casperPlay.stderr.on('data', function(data) {
    //console.log("stderr: ${data}");
});

casperPlay.on('close', function(code) {
    console.log("child process exited with code ${code}");
});

function didSave()
{
  leftSave --;
  if(leftSave == 0)
    process.exit();
}

function updateOnePlay(json)
{
  var play = new Play();
  play.link = json.link;
  play.screen = json.screen;
  play.leftSeat = json.leftSeat;
  play.totalSeat = json.totalSeat;
  play.type = json.type;
  play.endTime = json.endTime;
  play.startTime = json.startTime;
  play.option = json.option;
  play.place = json.place;
  play.brand = json.brand;
  play.theater = json.theater;
  play.weekday = json.weekday;
  play.day = json.day;
  play.month = json.month;
  play.age = json.age;
  play.title = json.title;

  //console.log(play.title);
  play.save(function(err){
    if(err)
      console.error(err);
    didSave();
  });
}

function updatePlay(jsonarr)
{
  //console.log(JSON.parse(jsonarr)[0]);
  var arr = JSON.parse(jsonarr);
  //console.log(arr[0]);
  leftSave = arr.length;
  //console.log("play number : " + leftSave);
  arr.forEach(function(jsonObj, n){
    console.log(jsonObj);
    updateOnePlay(jsonObj);
  });
}

function updateDB()
{

  updatePlay(casperData);
  //process.exit();
}
