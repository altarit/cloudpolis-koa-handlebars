exports.index = function *(next) {
  yield this.render('index.html', {title: 'EquestriaJS', part: this.request.isAjax});
};

//res.render('index', {part: req.isAjax});