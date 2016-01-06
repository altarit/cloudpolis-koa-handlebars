var templates_names = [
  'entry_template',
  'copy_songlist',
  'songlist',
  'song'
];

var templates = {};
templates_names.forEach(function(name) {
  templates[name] = require('templates/' + name + '.hbs');
});


module.exports = templates;