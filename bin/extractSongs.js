var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('lib/mongoose');
var id3 = require('id3js');
var deasync = require('deasync');
var Song = require('models/song').Song;
var Compilation = require('models/compilation').Compilation;


/*id3({ file: 'D:\\Documents\\Music\\mlp2\\MAv16\\Fanmade\\Artists\\M_Pallante\\M_Pallante - Oh, Celestia.mp3', type: id3.OPEN_LOCAL }, function(err, tags) {
 console.log(err);
 console.log(tags);
 });*/


async.series([
  open,
  /*dropCompilations,*/
  createModels,
  extractSongs
], done);

function open(callback) {
  console.log('open');
  mongoose.connection.on('open', callback);
}

function dropCompilations(callback) {
  console.log('dropCompilations');
  var songs = mongoose.connection.collections['songs'];
  if (songs)
    songs.drop(callback);
  else
    callback(null);
}

function createModels(callback) {
  console.log('createModels');
  //require('models/compilation');
  async.each(Object.keys(mongoose.models), function (modelName, callback) {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

function extractSongs(callback) {
  Compilation.find({}, function (err, allCompilations) {
    if (err) return callback(err);

    async.each(allCompilations, function (currentCompilation) {
      console.log(currentCompilation.name);
      async.each(currentCompilation.songs, function (currentSong) {
        var newSong = new Song({
          title: currentSong.title,
          artist: currentSong.artist,
          album: currentSong.album,
          compilation: currentCompilation.name,
          href: currentSong.href
        });
        newSong.save();
      });
    });
    callback(null);
  });
}

function done(err, results) {
  if (err)
    console.log('\nerr=' + err);
  else
    console.log('\nDone. Press Ctrl+C for exit...');
}