module.exports = function *(next) {
  this.locals.isAjax = (this.request.headers['x-requested-with'] == 'XMLHttpRequest');
  this.locals.isJson = (this.request.headers['x-expected-format'] == 'JSON');
  if (this.locals.isAjax || this.locals.isJson) {
    this.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    this.set('Expires', '-1');
    this.set('Pragma', 'no-cache');
  }
  yield next;
};