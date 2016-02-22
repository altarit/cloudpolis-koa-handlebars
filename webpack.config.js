var path = require('path');

module.exports = {
  entry: "js/main",


  output: {
    path: "public/js/",
    publicPath: "/js/",
    filename: "[name].js",
    library: "[name]"
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 200
  },

  devtool: "source-map",

  resolve: {
    root: [__dirname],
    modulesDirectories: ['node_modules', 'frontend'],
    //extensions: ['*', '*.js', '*.hbs'],
    alias: {
      "handlebars-runtime": __dirname + "/bower_components/handlebars/handlebars.runtime.js",
      "js": "frontend/js",
      "templates": "views/_templates"
    }
  },
  module: {
    //loaders: [{ test: /\.hbs$/, loader: "handlebars-loader" }]
    loaders: [{
      test: /\.hbs$/,
      include: [path.resolve(__dirname, 'views/_templates/partials')],
      loader: "raw-loader"
    }]
  }
};
console.log(__dirname);