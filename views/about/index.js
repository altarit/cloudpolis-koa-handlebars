exports.init = function(req, res, next) {
  res.render('about', {part: req.isAjax});
};
