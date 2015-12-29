//var async = require('async');
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
    }
});

schema.statics.add = function (url, body, user, session, ip) {
  var Request = this;
  return new Promise(function(resolve, reject) {
    var request = new Request({url: url, body: body, user: user, session: session, ip: ip});
    request.save(function (err) {
      if (err) return reject(err);
      return resolve();
    });
  });
};

exports.Request = mongoose.model('Request', schema);




