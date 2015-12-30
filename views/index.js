exports.index = function *(next) {
  yield this.render('index.html', {locals: this.locals});
};

//res.render('index', {part: req.isAjax});