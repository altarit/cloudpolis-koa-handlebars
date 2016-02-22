exports.index = function *(next) {
  yield this.render('index.html', {});
};

exports.inprogress = function * (next) {
  this.body = 'Not implemented yet.'
};

exports.test = function * (next) {
  yield this.render('test.html', {});
};