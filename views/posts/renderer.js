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
    open: function *(param, tag) {
      var aud = yield Song.find({href: param});
      if (aud && aud[0]) {
        var html = new handlebars.SafeString(templates[tag](aud[0]));
        return html;
      } else {
        return '<div>Missed content</div>';
      }
    }
  },
  'img': {
    closes: false,
    allowed: ['a'],
    open: function *(param, tag) {
      return new handlebars.SafeString(templates[tag]({src: param}));
    }
  },
  'a': {
    closes: true,
    open: function *(param, tag) {
      if (!param || param[0] != '/')
        return new handlebars.SafeString(templates[tag]({href: '/403'}));
      return new handlebars.SafeString(templates[tag]({href: param}));
    }
  },
  'b': {
    closes: true,
    allowed: ['a']
  },
  'i': {
    closes: true,
    allowed: ['a']
  },
  'br': {
    closes: false
  },
  'imgleft': {
    closes: false,
    allowed: ['a'],
    open: function *(param, tag) {
      return new handlebars.SafeString(templates[tag]({src: param}));
    }
  },
  'clear': {
    closes: false,
    open: function *(param, tag) {
      return new handlebars.SafeString(templates[tag]());
    }
  }
};
var templates = {};
var regexp;

function *transform(source, req) {
  var self = this.request;
  req.usedTags = [];
  //var regexp = /\[(audio|video|img|a|\/a|b|\/b)(="(.*?)"){0,1}\]/g;
  return new Promise((resolve, reject) => {
    replaceAsync(source, regexp,
      replacePost.bind(req),
      function (err, result) {
        if (err) reject(err);
        else {
          var tagsClosing = req.usedTags.length ? '</'+req.usedTags.reverse().join('')+'>' : '';
          if (tagsClosing)
            log.debug(tagsClosing);
          resolve(result + tagsClosing);
        }
      }
    );
  });
}

function replacePost(callback, match, tag, eq, param) {
  //console.log(match);
  if (eq && !tags[tag].open)
    return callback(null, ' Extra param ');
  if (tag[0] == '/') {
    if (this.usedTags.length == 0)
      return callback(null, 'Extra ' + tag);
    var prev = this.usedTags[this.usedTags.length-1];
    if (prev != tag.slice(1)) {
      this.usedTags = [];
      return callback(null, '</'+this.usedTags.reverse().join('')+'>Close ' + prev + ' before ' + tag);
    }
    this.usedTags.pop();
    return callback(null, '<' + tag + '>');
  }
  if (!tags[tag].open) {
    if (this.usedTags.length != 0 && !~tags[tag].allowed.indexOf(this.usedTags[this.usedTags.length - 1]))
      return callback(null, tag + ' in ' + this.usedTags[this.usedTags.length - 1] + ' not allowed');
    if (tags[tag].closes)
      this.usedTags.push(tag);
    return callback(null, '<' + tag + '>');
  }
  if (param && ~param.indexOf("\""))
    return callback(null, ' Damaged param ' + ~param.indexOf("\"") + ' ' + param);

  if (tags[tag].closes)
    this.usedTags.push(tag);
  co(tags[tag].open(param, tag))
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

function *getSongByHref(href) {
  var found = yield Song.find({href: href});

}


//load templates
regexpStr = '';
Promise.all(Object.keys(tags).forEach((tag)=> {
  regexpStr += tag+'|';
  if (tags[tag].closes)
    regexpStr += '\\/'+tag+'|';
  if (tags[tag].open)
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