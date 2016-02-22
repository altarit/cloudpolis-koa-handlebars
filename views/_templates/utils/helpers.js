var libs = {};
var functions = {};
exports.init = function(ctx) {
  libs = ctx;
};
exports.functions = functions;


functions.safe = function(html) {
  return new libs.Handlebars.SafeString(html);
};

functions.moment = function(date) {
  if (!date) return '';
  return libs.moment(date).format('YYYY-MM-DD HH:mm:ss');
};

functions.momentFrom = function(date) {
  if (!date) return '';
  return libs.moment(date).fromNow();
};

functions.momentTag = function(date) {
  if (!date) return '';
  return libs.moment(date).format('YYYY-MM-DDThh:mm:ss');
};
