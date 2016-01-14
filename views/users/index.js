var HttpError = require('error').HttpError;
var User = require('models/user').User;

exports.init = function *(next) {
  var found = yield User.find({});
  yield this.render('users/index.html', {locals: this.locals, users: found});
};


exports.detail = function *(next) {
  var req = this.request;
  var id = this.params.id;
  var user = yield User.findOneByName(id);
  //if (err) return next(new HttpError(500, "������ � /users/-id/index.js"));
  if (user) {
    yield this.render('users/detail.html', {locals: this.locals, profile: user});
  } else {
    throw new HttpError(404, "User not found.");
}
};

exports.update = function *(next) {
  var id = this.params.id;
  var role = this.request.body.newrole;
  var affected = yield User.addRole(id, role);
  //if(err) return next(new HttpError(500, 'Error in /views/posts/-id/index.js'));
  return this.body = affected;
};