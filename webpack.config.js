'use strict';
const path = require('path');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  entry: "js/main",


  output: {
    path: "public/js/",
    publicPath: "/js/",
    filename: "[name].js",
    library: "[name]"
  },

  watch: NODE_ENV == "development",

  watchOptions: {
    aggregateTimeout: 200
  },

  devtool: NODE_ENV == "development" ? "source-map" : "none",

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
  },

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      LANG: JSON.stringify('eng')
    })
  ]


};


if(true) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true,
      }})
  );

}