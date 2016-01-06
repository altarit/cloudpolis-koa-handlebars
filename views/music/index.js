var Song = require('models/song').Song;
var Compilation = require('models/compilation').Compilation;
var HttpError = require('error').HttpError;
//var async = require('async');


//TODO: refactor: move next() into DB function call.
function getCollections(req, next) {
  Compilation.find({}, {name: 1}).sort({name: 1}).exec(function(err, found) {
    return next(err, found);
  });
}

function getSongs(req, next) {
  Compilation.find({name: req.params.compilation}).sort({name: 1}).exec(function(err, found) {
    return next(err, found);
  });
}

function * sendHTMLResult(next) {
  var compilations = yield Compilation.find({}, {name: 1}).sort({name: 1}).exec();
  var songs = yield Compilation.find({name: this.params.compilation}).sort({name: 1}).exec();
  //if (err) return next(new HttpError(500, "Ошибка в /music/index.js"));
  yield this.render('music/library', {locals: this.locals, compilations: compilations, songs: songs});
}

function * sendJSONResult(next) {
  var compilation = yield Compilation.find({name: this.params.compilation}).sort({name: 1}).exec();
  if (compilation.length)
    this.body = {data: compilation[0], title: compilation[0]._doc.name};
  else
    throw 404;
}

exports.library = function *(next) {
  if (!this.locals.isJson)
    yield sendHTMLResult;
  else
    yield sendJSONResult;
};

exports.search = function *(next) {
  var query = this.request.query.query;
  try {
    var filter = {
      title: {$regex: new RegExp(query,'i')}
    };
  } catch(e) {
    throw new HttpError(402, 'Неверный фильтр');
  }

  var filteredSongs = yield Song.find(filter).limit(50).exec();
  if (!this.locals.isJson)
    yield this.render('music/search', {locals: this.locals, songs: filteredSongs});
  else
    this.body =  {data: {songs: filteredSongs}};
};

exports.artists = function*(next) {
  var found = yield Compilation.find({}, {name: 1, _id: 0}).sort({name: 1}).exec();
  //if (err) return next(500, 'Ошибка в music/index.js');
  yield this.render('music/artists.html', {locals: this.locals, artists: found});
};

exports.songs = function *(next) {
  var found = yield Compilation.find({name: this.params.id}).sort({name: 1}).exec();
  //if (err) return next(500, 'Ошибка в music/index.js');
  if (found[0])
    return yield this.render('music/songs.html', {locals: this.locals, artist: found[0]});
  else
    throw 404;
};

exports.init = function *(next) {
  yield this.render('music/index.html', {locals: this.locals});
};