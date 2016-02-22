var libs = {};

libs.Handlebars = require('handlebars');
libs.moment = require('moment');


let helpers = require('./helpers');
helpers.init(libs);

for(var name in helpers.functions) {
  module.exports[name] = helpers.functions[name];//.bind(scope);
}

//module.exports = scope;
//console.log(module.exports);