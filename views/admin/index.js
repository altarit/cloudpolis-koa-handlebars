var moment = require('moment');
var Request = require('models/request').Request;
var HttpError = require('error').HttpError;

exports.init = function * (next) {
  var requests = yield Request.find({}).sort({created: -1}).limit(50).exec();
  yield this.render('admin/index.html', {locals: this.locals, requests: requests, moment: moment});
};


exports.accesslog = function * (next) {
  var req = this.request;
  var url = req.query.url;
  var user = req.query.user || '.*';
  var session = req.query.session || '.*';
  /*console.log(url);
   console.log(user);
   console.log(session);*/
  try {
    var filter = {
      url: {$regex: new RegExp(url)},
      user: {$regex: new RegExp('^'+user+'$','i')}
      //session: {$regex: new RegExp('^'+session+'$')}
    };

    var requests = yield Request.find(filter).sort({created: -1}).limit(50).exec();
    console.log(filter);
    console.log(requests);
    yield this.render('admin/access.html', {locals: this.locals, requests: requests, moment: moment});
  } catch(e) {
    throw new HttpError(402, 'Неверный фильтр'+e);
  }
};