var crypto = require('crypto');
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
    additional: {
      type: String
    },
    avatar: {
      type: Boolean
    },
    roles: {
      type: Object
    }
  }
);

schema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._plainPassword;
  });

schema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) == this.hashedPassword;
};

schema.statics.findOneByName = function* (username) {
  var User = this;
  return User.findOne({username: {$regex: new RegExp('^' + username + '$', 'i')}});
};

schema.statics.authorize = function* (username, password) {
  var User = this;
  var user = yield User.findOneByName(username);
  if (user) {
    if (user.checkPassword(password))
      return user;
    else
      throw new AuthError('Пароль неверен');
  } else {
    throw new AuthError('Такого логина не существует');
  }
};

schema.statics.register = function* (username, password, email, additional) {
  var User = this;
  if (!/^.{1,20}$/.test(username))
    throw new AuthError('Имя должно быть длиной до 20 символов, состоять из латинских букв, цифр и некоторых знаков. Ну Вы знаете, везде так.');
  if (!/^.{0,40}$/.test(password))
    throw new AuthError('Пароль 6-40 символов.');

  var user = yield User.findOneByName(username);
  if (user) {
    throw new AuthError('Логин занят');
  } else {
    var user = new User({username: username, password: password, email: email, additional: additional});
    return user.save();
  }
};

schema.statics.edit = function* (username, oldpassword, newpassword, email, additional) {
  var User = this;

  var user = yield User.findOneByName(username);
  if (!user) {
    throw new AuthError('Юзера не существует');
  }
  if (newpassword) {
    if (!user.checkPassword(oldpassword))
      throw new AuthError('Неверный пароль');
    if (!/^.{0,40}$/.test(newpassword))
      throw new AuthError('Пароль 6-40 символов');
    user.password = newpassword;
  }
  user.additional = additional;
  return user.save();
};

schema.statics.addRole = function (username, role) {
  var User = this;
  return User.update({username: username}, {$addToSet: {roles: role}});
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





