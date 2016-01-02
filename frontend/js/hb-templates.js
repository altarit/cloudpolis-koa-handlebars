var templates_names = [
  'entry_template',
  'hb_copy_songlist',
  'hb_songlist'
];
var templates = {};
templates_names.forEach(function(name) {
  templates[name] = require('../templates/' + name + '.hbs');
});
