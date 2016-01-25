var HttpError = require('error').HttpError;
var User = require('models/user').User;
var AuthError = require('models/user').AuthError;

exports.init = function *(next) {
  var found = yield User.find({});
  yield this.render('users/index.html', {locals: this.locals, users: found});
};


exports.detail = function *(next) {
  var req = this.request;
  var id = this.params.id;
  var user = yield User.findOneByName(id);
  if (user) {
    yield this.render('users/detail.html', {locals: this.locals, profile: user});
  } else {
    throw new HttpError(404, "User not found.");
  }
};

/*exports.update = function *(next) {
  var id = this.params.id;
  var role = this.request.body.newrole;
  var affected = yield User.addRole(id, role);
  return this.body = affected;
};*/

exports.edit = function *(next) {
  var req = this.request;
  var id = this.params.id;
  if (!this.locals.user.username || this.locals.user.username != id)
    throw new HttpError(403, "Access denied");
  var user = yield User.findOneByName(id);
  if (user) {
    yield this.render('users/edit.html', {locals: this.locals, profile: user});
  } else {
    throw new HttpError(404, "User not found.");
  }
};

exports.update = function *(next) {
  var req = this.request;
  var id = this.params.id;
  if (!this.locals.user.username || this.locals.user.username != id)
    throw new HttpError(403, "Access denied");

  var oldpassword = req.body.oldpassword.trim();
  var newpassword = req.body.newpassword.trim();
  var additional = req.body.additional.trim();


  try {
    yield User.edit(id, oldpassword, newpassword, 'email', additional);
    this.body = {}; //actually it is not needed
  } catch (err) {
    if (err instanceof AuthError) {
      throw new HttpError(403, err.message);
    } else {
      throw err;
    }
  }
  //this.redirect = '/';
};