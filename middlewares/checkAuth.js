var HttpError = require('error').HttpError;
var log = require('lib/log')(module);

module.exports = function *(next) {
  if (!this.session.user)
    throw new HttpError(401, 'Вы не авторизованы');
  else
    yield next;
};