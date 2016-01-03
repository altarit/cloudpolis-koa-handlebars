module.exports = {
  entry: "./frontend/js/blog",
  output: {
    filename: "./public/js/bundle.js",
    library: "home"
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 200
  },

  devtool: "source-map",


  /*module: {
    loaders: [
      { test: /.\.hbs$/, loader: "handlebars-loader" }
    ]
  }*/
  module: {
    loaders: [{ test: /\.hbs$/, loader: "handlebars-loader" }]
  }
};