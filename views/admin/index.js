var moment = require('moment');
var Request = require('models/request').Request;

exports.init = function(req, res, next) {
  Request.find({}).sort({created: -1}).limit(50).exec(function(err, found) {
    res.render('admin', {part: req.isAjax, requests: found, moment: moment});
  });
};
