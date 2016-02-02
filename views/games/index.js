exports.index = function *(next) {
  yield this.render('games/index.html', {locals: this.locals});
};

exports.chat = function *(next) {
  yield this.render('games/chat.html', {locals: this.locals});
};


exports.hook = function *(next) {
  yield this.render('games/hook.html', {locals: this.locals});
};