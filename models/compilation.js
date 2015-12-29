var async = require('async');
var util = require('util');
var log = require('lib/log')(module);

var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  songs: {
    type: Object
  }
});

exports.Compilation = mongoose.model('Compilation', schema);




