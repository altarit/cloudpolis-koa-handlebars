var moment = require('moment');
var Post = require('models/post').Post;
var HttpError = require('error').HttpError;
var PostError = require('models/post').PostError;
var renderer = require('./renderer');
var log = require('lib/log')(module);

exports.init = function * (next) {
  var posts = yield Post.find({}).sort({_id: -1}).exec();
  yield this.render('posts/index.html', {locals: this.locals, posts: posts, moment: moment});
};


exports.detail = function *(next) {
  var post = yield Post.findOne({_id: this.params.id});
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
  if (this.params.id && Number.isInteger(+this.params.id)) {
    var post = yield Post.findOne({_id: this.params.id});
    if (post)
      yield this.render('posts/addpost.html', {locals: this.locals, post: post});
  } else {
    yield this.render('posts/addpost', {locals: this.locals});
  }
};

exports.create = function *(next) {
  var name = this.request.body.postname.trim();
  var content = this.request.body.postcontent.trim();

  var rendered = yield renderer.transform(content, this.request);
  try {
    var post = yield Post.create(name, content, this.locals.user.username, null, rendered);
    yield this.redirect('/posts/'+post._id);
  } catch (err) {
    if (err instanceof PostError) {
      throw new HttpError(403, err.message);
    } else {
      throw err;
    }
  }
};

exports.edit = function *(next) {
  var name = this.request.body.postname.trim();
  var content = this.request.body.postcontent.trim();
  var rendered = yield renderer.transform(content, this.request);
  try {
    var post = yield Post.edit(name, content, this.locals.user.username, null, rendered, this.params.id);
    this.redirect('/posts/'+post._id);
  } catch (err) {
    if (err instanceof PostError) {
      throw new HttpError(403, err.message);
    } else {
      throw err;
    }
  }
};