var mongoose = requie('mongoose');
var Schema = mongoose.Schema;

var movie = new Schema({
	title : String,
	timetable :[],
	review : [String],
	score : Number
});

module.exports = mongoose.model('movie', movie);
