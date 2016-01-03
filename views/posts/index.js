var moment = require('moment');
var Post = require('models/post').Post;
var HttpError = require('error').HttpError;
var PostError = require('models/post').PostError;

exports.init = function * (next) {
  var posts = yield Post.find({});
  yield this.render('posts/index.html', {locals: this.locals, posts: posts, moment: moment});
};


exports.detail = function *(next) {
  var post = yield Post.findOne({_id: this.params.id});
  //if (err) return next(new HttpError(500, "Ошибка в /users/-id/index.js"));
  if (post) {
    yield this.render('posts/detail.html', {locals: this.locals, post: post, moment: moment});
  }
};


exports.comment = function *(next) {
  var text = this.request.body.text.trim();

  try {
    var affected = yield Post.addComment(this.params.id, text, this.locals.user.username);
    this.body = affected;
  } catch (err) {
    if (err instanceof PostError) {
      throw new HttpError(403, err.message);
    } else {
      throw err;
    }
  }
};


exports.addpost = function *(next) {
  yield this.render('posts/addpost', {locals: this.locals})
};

exports.create = function *(next) {
  var name = this.request.body.postname.trim();
  var content = this.request.body.postcontent.trim();

  try {
    var post = yield Post.create(name, content, this.locals.user.username);
    this.redirect('/posts/'+post._id);
  } catch (err) {
    if (err instanceof PostError) {
      throw new HttpError(403, err.message);
    } else {
      throw err;
    }
  }
};
