var templateSong = require('./../js/hb-templates.js')['song'];
var Handlebars = require('handlebars');

module.exports = function(json) {
  var song = JSON.parse(json);
  return new Handlebars.SafeString(templateSong(song));
};