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
  href: {
    type: String,
    requred: true
  },
  duration: {
    type: String
  },
  size: {
    type: Number
  }
});

exports.Song = mongoose.model('Song', schema);




