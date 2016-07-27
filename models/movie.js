var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
	title : String,
  imageURL : String
});

module.exports = mongoose.model('movies', movieSchema);
