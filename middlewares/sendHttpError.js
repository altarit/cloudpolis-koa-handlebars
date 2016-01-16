var log = require('lib/log')(module);
var HttpError = require('error').HttpError;

module.exports = function *(next) {
  try {
    yield next;
  } catch (err) {
    if (typeof err == 'number') {
      log.debug('!number');
      err = new HttpError(err);
    }

    //console.log(err.prototype.name);
    log.error(err);

    this.response.status = err.status || 500;
    if (this.req.headers['x-requested-with'] == 'XMLHttpRequest') {
      this.body = err;
    } else {
      yield this.render("error.html", {locals: this.locals, error: err});
    }
  }
};