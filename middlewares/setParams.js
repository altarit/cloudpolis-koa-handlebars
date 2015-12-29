module.exports = function *(next) {
  //req.part = req.query.part != null;
  this.request.isAjax = (this.request.headers['x-requested-with'] == 'XMLHttpRequest');
  this.request.isJson = (this.request.headers['x-expected-format'] == 'JSON');
  yield next;
};