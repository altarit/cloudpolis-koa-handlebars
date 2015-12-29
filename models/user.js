var crypto = require('crypto');
//var async = require('async');
var util = require('util');
var log = require('lib/log')(module);

var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        requred: true
    },
    salt: {
        type: String,
        requred: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String
    },
    roles: {
      type: Object
    }
  }
);

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) == this.hashedPassword;
};

schema.statics.findOneByName = function(username, callback) {
    var User = this;
    User.findOne({username: { $regex: new RegExp('^' + username + '$', 'i') } }, callback);
};



schema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOneByName(username, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    return callback(null, user);
                } else {
                    return callback(new AuthError('Пароль неверен'));
                }
            } else {
                return callback(new AuthError('Такого логина не существует'));
            }
        }
    ], callback);
};

schema.statics.register = function(username, password, email, additional, callback) {
    var User = this;
    async.waterfall([
        function(callback) {
            if (!/^.{1,20}$/.test(username))
                return callback(new AuthError('Имя должно быть длиной до 20 символов, состоять из латинских букв, цифр и некоторых знаков. Ну Вы знаете, везде так.'));
            if (!/^.{0,40}$/.test(password))
                return callback(new AuthError('Пароль 6-40 символов.'));
            callback(null);
        },
        function(callback) {
            User.findOneByName(username, callback);
        },
        function(user, callback) {
            if (user) {
                return callback(new AuthError('Логин занят'));
            } else {
                var user = new User({username: username, password: password, email: email});
                user.save(function(err) {
                    if (err) return callback(err);
                    return callback(null, user);
                });
            }
        }
    ], callback);
};

schema.statics.addRole = function (username, role, callback) {
  var User = this;
  User.update({username: username}, {$addToSet: {roles: role}}, callback);
};

exports.User = mongoose.model('User', schema);



function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;





