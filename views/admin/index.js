var moment = require('moment');
var Request = require('models/request').Request;
var HttpError = require('error').HttpError;

exports.init = function * (next) {
  yield this.render('admin/index.html', {});
};


exports.accesslog = function * (next) {
  var req = this.request;
  var url = req.query['filter-url'];
  var user = req.query['filter-user'];
  var session = req.query['filter-session'];
  try {
    var filter = {
      url: {$regex: new RegExp(url)}
      //session: {$regex: new RegExp('^'+session+'$')}
    };
    if (user)
      filter.user = {$regex: new RegExp('^'+user+'$','i')};

    if (session)
      filter.session = {$regex: new RegExp('^'+session+'$','i')};

    var requests = yield Request.find(filter).sort({created: -1}).limit(100).exec();
    console.log(filter);
    //console.log(requests);

    if (!this.locals.isJson)
      yield this.render('admin/access.html', {requests: requests});
    else
      this.body = { data: { requests: requests } };
  } catch(e) {
    //throw new HttpError(402, 'Неверный фильтр'+e);
    throw e;
  }
};


exports.statistic = function * (next) {
  yield this.render('admin/index.html', {});
};


exports.control = function * (next) {
  yield this.render('admin/index.html', {});
};