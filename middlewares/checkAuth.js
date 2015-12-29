var HttpError = require('error').HttpError;
var log = require('lib/log')(module);

module.exports = function *(next) {
  log.debug(1);
  if (!this.session.user) {
      //yield next(new HttpError(401, 'Вы не авторизованы'));
    throw new HttpError(401, 'Вы не авторизованы');
  }
  yield next;
};