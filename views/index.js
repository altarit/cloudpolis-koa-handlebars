exports.index = function *(next) {
  yield this.render('index.html', {locals: this.locals});
};

exports.inprogress = function * (next) {
  this.body = 'Not implemented yet.'
};

//res.render('index', {part: req.isAjax});