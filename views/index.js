exports.index = function *(next) {
  yield this.render('index.html', {locals: this.locals});
};

exports.inprogress = function * (next) {
  this.body = 'Not implemented yet.'
};

exports.test = function * (next) {
  yield this.render('test.html', {locals: this.locals});
};