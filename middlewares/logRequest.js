var Request = require('models/request').Request;
var log = require('lib/log')(module);

module.exports = function *(next) {

  var start = new Date();
  yield next;

  if (/\.(css|js|0|map|img)$/.test(this.request.url))
    return;

  var responseTime = new Date() - start;
  var req = this.request;
  console.info('--> %s %s %sms %s', this.method, req.url, responseTime, this.response.status);
  var request = new Request({
    url: req.url,
    body: req.body,
    user: req.user ? req.user._doc.username : null,
    session: this.sessionId,
    ip: req.headers['x-real-ip'] || req.ip,
    time: responseTime,
    status: this.response.status
  });
  yield request.save();
};

