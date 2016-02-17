// dependencies
var Renderer = require("./renderer.js");

// single export
exports = module.exports = function (options) {
  return Renderer(options).middleware();
};

// export the class
exports.Renderer = Renderer;
