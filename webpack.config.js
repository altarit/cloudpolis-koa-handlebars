module.exports = {
  entry: "./frontend/js/entry",


  output: {
    path: "public/js/",
    publicPath: "/js/",
    filename: "bundle.js",
    library: "entry"
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 200
  },

  devtool: "source-map",

  resolve: {
    root: [__dirname],
    //modulesDirectories: __dirname+'node_modules',
    alias: {
      "handlebars-runtime": __dirname + "/bower_components/handlebars/handlebars.runtime.js",
      "js": "frontend/js",
      "templates": "frontend/templates"
    }
  },



  module: {
    loaders: [{ test: /\.hbs$/, loader: "handlebars-loader" }]
  }
};