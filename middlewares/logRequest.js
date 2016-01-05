var Request = require('models/request').Request;
var log = require('lib/log')(module);

module.exports = function *(next) {
  var req = this.request;
  var ip = req.headers['x-forwarded-for'] || '1.2.3.4';//req.connection.remoteAddress;
  var user = (req.user) ? req.user._doc.username : null;
  if (/\.(css|js|4\.0|map)$/.test(req.url))
      return yield next;
  else
    yield Request.add(req.url, req.body, user, req.sessionId, ip);
  yield next;
};

