var util = require('util');
var log = require('lib/log')(module);

var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title: {
    type: String,
    requred: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String
  },
  compilation: {
    type: String,
    requred: true
  },
  path: {
    type: String,
    requred: true
  }
});

exports.Song = mongoose.model('Song', schema);




