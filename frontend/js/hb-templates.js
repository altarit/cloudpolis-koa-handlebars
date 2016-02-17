var templates_names = [
  'entry_template',
  'copy_songlist',
  'songlist',
  'partials/song',
  'partials/copy_song',
  'accesslog'
];

var templates = {};
templates_names.forEach(function (name) {
  templates[name] = require('templates/' + name + '.hbs');
});


module.exports = templates;