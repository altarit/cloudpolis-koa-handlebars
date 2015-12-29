var log = require('lib/log')(module);

module.exports = function (req, res, next) {

  res.sendHttpError = function (error) {
    res.status(error.status);
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
      log.debug('!ajax');
      console.dir(error);
      res.json(error);
    } else {
      log.debug('!get');
      res.render("error", {error: error});
      //res.send('123');
    }
  };
  next();
};