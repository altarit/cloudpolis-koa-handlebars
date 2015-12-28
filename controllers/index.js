exports.index = function *(next) {
  yield this.render('index.html', {title: 'EquestriaJS'});
  yield next;
};