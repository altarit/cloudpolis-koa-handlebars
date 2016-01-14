module.exports = function *(next) {
  this.locals.isAjax = (this.request.headers['x-requested-with'] == 'XMLHttpRequest');
  this.locals.isJson = (this.request.headers['x-expected-format'] == 'JSON');
  yield next;
};