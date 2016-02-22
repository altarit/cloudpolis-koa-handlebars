var Song = require('models/song').Song;
var Compilation = require('models/compilation').Compilation;
var HttpError = require('error').HttpError;


function * sendHTMLResult(next) {
  var compilations = yield Compilation.find({}, {name: 1}).sort({name: 1}).exec();
  var songs = yield Compilation.find({name: this.params.compilation}).sort({name: 1}).exec();
  console.log('songs: '+songs[0]);
  yield this.render('music/library.html', {compilations: compilations, songs: songs[0]});
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
    yield this.render('music/search.html', {songs: filteredSongs});
  else
    this.body =  {data: {songs: filteredSongs}};
};

exports.artists = function *(next) {
  var found = yield Compilation.find({}, {name: 1, _id: 0}).sort({name: 1}).exec();
  yield this.render('music/artists.html', {artists: found});
};

exports.songs = function *(next) {
  var found = yield Compilation.find({name: this.params.id}).sort({name: 1}).exec();
  if (found[0])
    return yield this.render('music/songs.html', {artist: found[0]});
  else
    throw 404;
};

exports.random = function *(next) {
  var count = yield Song.count({});
  var max = 20;
  var start = Math.floor(Math.random() * count - max);
  var result = yield Song.find({}).skip(start).limit(max).exec();
  this.body =  {data: {songs: result}};
};

exports.init = function *(next) {
  yield this.render('music/index.html', {});
};