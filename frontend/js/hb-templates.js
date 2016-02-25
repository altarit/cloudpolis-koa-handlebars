var templates_names = [
  'entry_template',
  'copy_songlist',
  'songlist',
  'accesslog'
];

var templates = {};
templates_names.forEach(function (name) {
  templates[name] = require('templates/partials/' + name + '.hbs');
});

//regoister partials
var partials_names = [
  'song',
  'copy_song'
];

partials_names.forEach((function (name) {
  Handlebars.registerPartial(name, require('templates/partials/'+name+'.hbs'));
}));

//rehister helpers
var helpers = require('templates/utils/helpers');
helpers.init({
  Handlebars: Handlebars,
  moment: moment
});
for(var name in helpers.functions) {
  Handlebars.registerHelper(name, helpers.functions[name]);
}



module.exports = templates;