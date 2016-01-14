var util = require('util');
var log = require('lib/log')(module);

var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String
  },
  body: {
    type: Object
  },
  user: {
    type: String
  },
  session: {
    type: String
  },
  ip: {
    type: String
  },
  time: {
    type: Number
  },
  status: {
    type: Number
  }
});

exports.Request = mongoose.model('Request', schema);




