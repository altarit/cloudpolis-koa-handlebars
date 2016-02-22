exports.index = function *(next) {
  yield this.render('games/index.html', {});
};

exports.chat = function *(next) {
  yield this.render('games/chat.html', {});
};


exports.hook = function *(next) {
  yield this.render('games/hook.html', {});
};