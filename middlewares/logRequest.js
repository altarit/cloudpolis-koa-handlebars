var Request = require('models/request').Request;
//var log = require('lib/log')(module);

module.exports = function *(next) {

  var start = new Date();
  yield next;

  if (/\.(css|js|4\.0|map|img)$/.test(this.request.url))
    return;
  var responseTime = new Date() - start;
  var req = this.request;
  console.info('--> %s %s %sms %s', this.method, req.url, responseTime, this.response.status);
  var request = new Request({
    url: req.url,
    body: req.body,
    user: req.user ? req.user._doc.username : null,
    session: req.sessionId,
    ip: req.headers['x-forwarded-for'] || req.ip,
    time: responseTime,
    status: this.response.status
  });
  yield request.save();
};

