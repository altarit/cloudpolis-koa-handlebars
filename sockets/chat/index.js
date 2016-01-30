var cookie = require('cookie');
var co = require('co');
var sessionStore = require('lib/sessionStore');
var mongoose = require('lib/mongoose');
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var log = require('lib/log')(module);

module.exports.use = function (io) {
  //authorization
  io.use(function (socket, callback) {
    var handshake = socket.handshake;
    handshake.cookies = cookie.parse(handshake.headers.cookie || ' ');
    var sid = handshake.cookies['koa.sid'];
    var sidSigned = handshake.cookies['koa.sid.sig'];

    co(function*(){
      if (!sid)
        throw new HttpError(403, 'Session is not defined');
      var koasid = 'koa:sess:' + sid;

      var sessionJSON = yield sessionStore.load(koasid);
      if (!sessionJSON)
        throw new HttpError(403, 'Session is not found');
      var session = JSON.parse(sessionJSON);
      if (!session.user)
        throw new HttpError(403, 'User is not defined');
      //TODO: check signed sid
      handshake.session = koasid;

      var user = yield User.findById(session.user);

      if (!user)
        throw new HttpError(403, 'User is not found');
      handshake.user = user.username;
      callback();
    })
    .catch((err) => {
        log.debug('Co error: ' + err);
        callback(err);
      });
  });

  io.on('connection', function (socket) {
    var username = socket.handshake.user;
    log.debug(username + ' joined');

    socket.emit('news', 'Welcome to the chat!');
    socket.on('news', function (data) {
      log.debug(data);
    });

    socket.broadcast.emit('join', username);
    socket.on('disconnect', function() {
      socket.broadcast.emit('leave', username);
    });

    socket.on('message', function (text, cb) {
      console.log(username + ': '+text);
      socket.broadcast.emit('message', username, text);
      cb();
    });
  });

  io.server.$sessionReload = function (sid){
    console.log('session:reload: '+sid);
    var clients = io.sockets;
    for(var clientId in clients) {
      var client = clients[clientId];

      if (client.handshake.session != 'koa:sess:' + sid) {
        console.log('!=' + client.handshake.session);
        continue;
      }
      console.log('== Need to reload');
      var handshake = client.handshake;

      client.disconnect();

      co(function*(){
        var koasid = 'koa:sess:' + sid;

        var sessionJSON = yield sessionStore.load(koasid);
        if (!sessionJSON)
          throw new HttpError(403, 'Session is not found');
        var session = JSON.parse(sessionJSON);
        if (!session.user)
          throw new HttpError(403, 'User is not defined');
        //TODO: check signed sid
        handshake.session = koasid;

        var user = yield User.findById(session.user);

        if (!user)
          throw new HttpError(403, 'User is not found');
        handshake.user = user.username;
        log.debug('success');
      })
        .catch((err) => {
          log.debug('Co error: ' + err);
        });
    };
  };

  return io;
};