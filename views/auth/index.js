var HttpError = require('error').HttpError;
var User = require('models/user').User;
var AuthError = require('models/user').AuthError;


exports.init = function *(next) {
    yield this.render('auth/index.html', {locals: this.locals});
};

exports.auth = function *(next) {
  var self = this;
  console.log('Auth POST');
  var req = this.request;
  var username = req.body.username.trim();
  var password = req.body.password.trim();
  var email = req.body.email.trim();
  var additional = req.body.additional.trim();
  var registration = req.body.isreg;

  try {
    if (!registration)
      yield User.authorize(username, password)
        .then(function (user) {
          self.session.user = user._id;
          //yield next;
          self.body = {username: user.name};
          //yield self.render('index.html', {title: 'EquestriaJS', part: self.request.isAjax});
        });
    else
      yield User.register(username, password, email, additional)
        .then(function(user) {
          self.session.user = user._id;
          //yield next;
          self.body = {username: user.name};
        });
  } catch (err) {
    if (err instanceof AuthError) {
      throw new HttpError(403, err.message);
    } else {
      throw err;
    }
  }

};

exports.logout = function *(next) {
  this.session = null;
  this.redirect('/');
};
