var handlebars = require('handlebars');
var fs = require('fs');
var Song = require('models/song').Song;
var Compilation = require('models/compilation').Compilation;
var replaceAsync = require('string-replace');
var co = require('co');
var log = require('lib/log')(module);

var rootDir = 'views/posts/tags/';
var tags = {
  'audio': {
    closes: false,
    template: true
  },
  'img': {
    closes: false,
    allowed: ['a'],
    template: true
  },
  'a': {
    closes: true,
    template: true
  },
  'b': {
    closes: true,
    allowed: ['a']
  }
};
var templates = {};
var regexp;

function *transform(source) {
  //var regexp = /\[(audio|video|img|a|\/a|b|\/b)(="(.*?)"){0,1}\]/g;
  return new Promise((resolve, reject) => {
    replaceAsync(source, regexp,
      replacePost,
      function (err, result) {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

function replacePost(callback, match, tag, eq, param) {
  if (eq && !replaceFunctions[tag])
    return callback(null, ' Extra param ');
  if (tag[0] == '/' || !replaceFunctions[tag])
    return callback(null, '<' + tag + '>');
  if (!param || ~param.indexOf("\""))
    return callback(null, ' Damaged param ');

  co(replaceFunctions[tag](param, tag))
    .then(
    (result) => {
      callback(null, result);
    },
    (err) => {
      log.error('callback(err)');
      callback(err);
    }
  );
}

var replaceFunctions = {
  'audio': function *(param, tag) {
    var aud = yield Song.find({href: param});
    if (aud && aud[0]) {
      var html = new handlebars.SafeString(templates[tag](aud[0]));
      return html;
    } else {
      return '<div>Missed content</div>';
    }
  },
  'img': function *(param, tag) {
    return new handlebars.SafeString(templates[tag]({src: param}));
  },
  'a': function *(param, tag) {
    if (!param || param[0] != '/')
      return new handlebars.SafeString(templates[tag]({href: '/403'}));
    return new handlebars.SafeString(templates[tag]({href: param}));
  }
};

function *getSongByHref(href) {
  var found = yield Song.find({href: href});

}


//load templates
regexpStr = '';
Promise.all(Object.keys(tags).forEach((tag)=> {
  regexpStr += tag+'|';
  if (tags[tag].closes)
    regexpStr += '\\/'+tag+'|';
  if (tags[tag].template)
    return new Promise(function (resolve, reject) {
      var file = rootDir + tag + '.hbs';
      fs.readFile(file, "utf-8", function (err, text) {
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
regexp = new RegExp('\\[(' + regexpStr.slice(0, -1) + ')(="(.*?)"){0,1}\\]', 'g');




module.exports.transform = transform;