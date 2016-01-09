var util = require('util');
var Counter = require('models/counter').Counter;
var log = require('lib/log')(module);

var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    requred: true
  },
  author: {
    type: String,
    requred: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: Object
  },
  rendered: {
    type: String
  },
  head: {
    type: String
  }
});

schema.statics.addComment = function *(id, text, author, rendered) {
  var Post = this;
  if (text.length < 1 || text.length > 100)
    throw new PostError('Максимальная длина комментария - 200 знаков.');
  return Post.update({_id: id}, {$addToSet: {comments: {text: text, author: author, created: Date.now()}}});
};


schema.statics.create = function *(name, text, author, head, rendered) {
  var Post = this;

  if (!/^.{4,200}$/.test(name))
    throw new PostError('Название поста должно быть от 4 до 200 знаков.');
  if (text.length < 4 || text.length > 10000)
    throw new PostError('Содержание поста должно быть от 4 до 10000 знаков. У вас ' + text.length);

  var post_id = yield new Promise((resolve, reject) => {
    Counter.findByIdAndUpdate({_id: 'post_id'}, {$inc: {seq: 1}}, (err, cnt) => {
      if (err) reject(err);
      else resolve(cnt.seq);
    });
  });

  if (!post_id) {
    throw new PostError('Пост занят');
  } else {
    var post = new Post({_id: post_id, name: name, text: text, author: author, rendered: rendered}, {_id: false});
    return post.save();
  }
};

schema.statics.edit = function *(name, text, author, head, rendered, id) {
  var Post = this;

  if (!/^.{4,200}$/.test(name))
    throw new PostError('Название поста должно быть от 4 до 200 знаков.');
  if (text.length < 4 || text.length > 10000)
    throw new PostError('Содержание поста должно быть от 4 до 10000 знаков. У вас ' + text.length);

  if (!id)
    throw new PostError('Wrong id');
  var post = yield Post.findById(id);
  if (!post)
    throw new PostError('Wrong id');
  if (post.author != author)
    throw new PostError('Access denied');
  //log.debug(post);
  post.text = text;
  post.head = head;
  post.rendered = rendered;
  return post.save();
};


exports.Post = mongoose.model('Post', schema);


function PostError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, PostError);

  this.message = message;
}
util.inherits(PostError, Error);
PostError.prototype.name = 'PostError';

exports.PostError = PostError;





