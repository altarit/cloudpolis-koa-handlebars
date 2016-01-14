var User = require('models/user').User;

module.exports = function * (next) {
  var self = this;
  var req = this.request;
  var res = this.response;
  req.user = this.locals.user = null;

  if (!this.session.user) return yield next;
  var user = yield User.findById(this.session.user);
  req.user = self.locals.user = user;

  yield next;
};