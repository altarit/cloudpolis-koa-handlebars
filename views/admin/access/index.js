var moment = require('moment');
var Request = require('models/request').Request;
var HttpError = require('error').HttpError;

exports.init = function(req, res, next) {
  var url = req.query.url;
  var user = req.query.user || '.*';
  var session = req.query.session || '.*';
  /*console.log(url);
  console.log(user);
  console.log(session);*/
  try {
    var filter = {
      url: {$regex: new RegExp(url)},
      user: {$regex: new RegExp('^'+user+'$','i')},
      session: {$regex: new RegExp('^'+session+'$')}
    };

    Request.find(filter).sort({created: -1}).limit(50).exec(function(err, found) {
      res.render('admin/access', {part: req.isAjax, requests: found, moment: moment});
    });
  } catch(e) {
    next(new HttpError(402, 'Неверный фильтр'));
  }


};
