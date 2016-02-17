var mongoose = require('lib/mongoose');

var schema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

exports.Counter = mongoose.model('Counter', schema);