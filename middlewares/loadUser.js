var User = require('models/user').User;

module.exports = function * (next) {
  var self = this;
  var req = this.request;
  var res = this.response;
  req.user = this.locals.user = null;

  if (!this.session.user) return yield next;
  //TODO: unknown predict
  yield User.findById(this.session.user, function(err, user) {
      if (err) throw err;

      req.user = self.locals.user = user;
  });

  yield next;
};