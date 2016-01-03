var log = require('lib/log')(module);
var HttpError = require('error').HttpError;

module.exports = function *(next) {
  try {
    yield next;
  } catch (err){
    if (typeof err == 'number') {
      log.debug('!number');
      err = new HttpError(err);
    }

    log.error(err);

    if (err instanceof HttpError) {
      log.debug('!HttpError');
    } else {
      log.debug('!Not a HttpError');
      /*if (app.get('env') == 'development') {
       //errorHandler()(err, req, res, next);

       //console.log(err.prototype.name);
       //log.error(err);
       res.sendHttpError(err);
       } else {
       //console.dir(err);
       res.sendHttpError(err);
       }*/
    }
    this.status = err.status | 500;
    if (this.req.headers['x-requested-with'] == 'XMLHttpRequest') {
      return this.body = err;
    } else {
      return yield this.render("error.html", {locals: this.locals, error: err});
    }
  }
};