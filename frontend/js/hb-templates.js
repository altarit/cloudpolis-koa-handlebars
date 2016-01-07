var templates_names = [
  'entry_template',
  'copy_songlist',
  'songlist',
  'partials/song'
];

var templates = {};
templates_names.forEach(function(name) {
  templates[name] = require('templates/' + name + '.hbs');
});


module.exports = templates;