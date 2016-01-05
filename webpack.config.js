module.exports = {
  entry: "./frontend/js/entry",
  output: {
    filename: "./public/js/bundle.js",
    library: "entry"
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 200
  },

  devtool: "source-map",

  resolve: {
    alias: {
      handlebars: __dirname + "/bower_components/handlebars/handlebars.runtime.js"
    }
  },

  module: {
    loaders: [{ test: /\.hbs$/, loader: "handlebars-loader" }]
  }
};