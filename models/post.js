var crypto = require('crypto');
var async = require('async');
var util = require('util');
var Counter = require('models/counter').Counter;

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
    }
});

schema.statics.findOneById = function(id, callback) {
    var Post = this;
    Post.findOne({_id: id}, callback);
};

schema.statics.addComment = function(id, text, author, callback) {
    var Post = this;

    if (text.length < 1 || text.length > 100)
        return callback(new PostError('Максимальная длина комментария - 200 знаков.'));
    Post.update({_id: id}, {$addToSet: {comments: { text: text, author: author, created: Date.now()}}}, callback);
};


schema.statics.create = function (name, text, author, callback) {
    var Post = this;

    async.waterfall([
        function (callback) {
            if (!/^.{4,200}$/.test(name))
                return callback(new PostError('Название поста должно быть от 4 до 200 знаков.'));
            if (text.length < 4 || text.length > 100)
                return callback(new PostError('Содержание поста должно быть от 4 до 10000 знаков.'));
            callback(null);
        },
        function (callback) {
            Counter.findByIdAndUpdate({_id: 'post_id'}, {$inc: {seq: 1}}, function (error, cnt) {
                if (error) return callback(error);
                callback(null, cnt.seq);
            });
        },
        function (post_id, callback) {
            if (!post_id) {
                callback(new PostError('Пост занят'));
            } else {
                var post = new Post({_id: post_id, name: name, text: text, author: author}, { _id: false });
                post.save(function (err) {
                    if (err) return callback(err);
                    callback(null, post);
                });
            }
        }
    ], callback);
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





