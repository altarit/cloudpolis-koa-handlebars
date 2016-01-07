var handlebars = require('handlebars');
var fs = require('fs');
var Song = require('models/song').Song;
var Compilation = require('models/compilation').Compilation;
var replaceAsync = require('string-replace');

var tags = {
  'audio': 'views/_templates/single_song.hbs'
};

var templates = {};

Promise.all(Object.keys(tags).map((tag)=> {
  return new Promise(function (resolve, reject) {
    fs.readFile(tags[tag], "utf-8", function (err, text) {
      if (err) return reject(err);
      resolve(text);
    });
  })
    .then((text) => {
      //console.log(text);
      return handlebars.compile(text);
    })
    .then((tmpl) => {
      templates[tag] = tmpl;
    })
}))
  .then((result) => {
    console.log('Templates has been loaded ');
  });


function *transform(source) {
  var regexp = /\[(audio|video)=".*?"\]/g;
  return new Promise((resolve, reject) => {
    replaceAsync(source, /\[(audio|video|image)=".*?"\]/g,
      replacePost,
      function (err, result) {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

function replacePost(callback, match, tag) {
  try {
    var param = match.slice(tag.length + 3, -2);
    replaceFunctions[tag](callback, param);
  } catch (err) {
    callback(err);
    //return 'missed';
  }
}

var replaceFunctions = {
  'audio': function(callback, param) {
    return Song.find({href: param})
      .then((song) => {
        //console.log(song);
        if (song && song[0]) {
          var html = new handlebars.SafeString(templates['audio'](song[0]));
          callback(null, html);
        } else {
          callback(null, '<div>Missed content</div>')
        }
      });
  }
};

function *getSongByHref(href) {
  var found = yield Song.find({href: href});

}

module.exports.transform = transform;