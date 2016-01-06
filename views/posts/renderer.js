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
  //var q = 'Friendship [audio="/Aviators/Acoustic - EP/Aviators - Acoustic - EP - 07 Friendship (Extended Acoustic Version).mp3"] Aviators - EP';
  /*return source.replace(/\[(audio|video)=".*?"\]/g, function(el, tag) {
   try {
   var param = el.slice(tag.length + 3, -2);
   //console.log(el.slice(tag.length + 3, -2));
   //console.log(tag);
   //var template = Handlebars.c
   //return '<b>Strong</b><br>Not strong';
   //console.log(templateText);

   var song = yield Song.findOne({href: param});
   var template = handlebars.compile(templates[tag]);
   return new handlebars.SafeString(template(song));
   //return new handlebars.SafeString(template({title: 'Friendship', artist: 'Aviators', href: el.slice(tag.length + 3, -2)}));
   } catch (err) {
   throw err;
   //return 'missed';
   }
   });*/



  return new Promise((resolve, reject) => {
    replaceAsync(source, /\[(audio|video)=".*?"\]/g,
      replacePost,
      function (err, result) {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });


  function replacePost(callback, match, tag) {
    try {
      console.log(match);
      var param = match.slice('audio'.length + 3, -2);
      console.log(param);
      Song.find({href: param})
        .then((song) => {
          console.log(song);
          if (song && song[0]) {
            var html = new handlebars.SafeString(templates['audio'](song[0]));
            callback(null, html);
          } else {
            callback(null, '<div>Missed content</div>')
          }
        });
        /*.catch((err) => {
          console.log('Error Error Error');
          console.log(err);
        })*/
      //return new handlebars.SafeString(template(song));
      //return new handlebars.SafeString(template({title: 'Friendship', artist: 'Aviators', href: el.slice(tag.length + 3, -2)}));
    } catch (err) {
      callback(err);
      //return 'missed';
    }
    //callback(null, );
  }
}

function *getSongByHref(href) {
  var found = yield Song.find({href: href});

}

module.exports.transform = transform;