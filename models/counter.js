var mongoose = require('lib/mongoose');

//db.counters.update({_id: "post_id"}, {_id: "post_id", seq: 0}, {upsert: 1});
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