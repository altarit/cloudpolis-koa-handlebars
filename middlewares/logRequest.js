var Request = require('models/request').Request;


module.exports = function *(next) {
  var req = this.request;
  var ip = req.headers['x-forwarded-for'] || '1.2.3.4';//req.connection.remoteAddress;
  var user = (req.user) ? req.user._doc.username : null;
  if (/\.(css|js)$/.test(req.url))
      return yield next;
  //console.log((/^\/(css|js)\/./.test(req.url)));
  yield Request.add(req.url, req.body, user, req.sessionId, ip);
  yield next;
};

