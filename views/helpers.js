var Handlebars = require('handlebars');
var moment = require('moment');

exports.safe = function(html) {
  return new Handlebars.SafeString(html);
};

exports.moment = function(date) {
  if (!date) return '';
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

exports.momentFrom = function(date) {
  if (!date) return '';
  return moment(date).fromNow();
};

exports.momentTag = function(date) {
  if (!date) return '';
  return moment(date).format('YYYY-MM-DDThh:mm:ss');
};

