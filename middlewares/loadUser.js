var User = require('models/user').User;

module.exports = function * (next) {
  var req = this.request;
  var res = this.response;
  req.user = /*res.locals.user =*/ null;

  if (!this.session.user) return yield next;
  //TODO: unknown predict
  yield User.findById(req.session.user, function(err, user) {
      if (err) throw err;

      req.user = res.locals.user = user;
  });

  yield next;
};