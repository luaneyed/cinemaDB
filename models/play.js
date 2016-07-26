var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playSchema = new Schema({
	title : String,
  age : String,
  month : String,
  day : String,
  weekday : String,
  theater : String,
  brand : String,
  place : String,
  option : String,
  startTime : String,
  endTime : String,
  type : String,
  totalSeat : String,
  leftSeat : String,
  screen : String,
  link : String
});

module.exports = mongoose.model('plays', playSchema);
