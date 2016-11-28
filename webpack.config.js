var webpack = require("webpack");
var fs = require("fs");

var license = fs.readFileSync(`./license.md`, "utf8");

module.exports = {
  entry: `./src/main/fsm.js`,
  output: {
    path: `./www/`,
    filename: "fsm.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|www)/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"],
          plugins: ["transform-object-rest-spread"]
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(license, {entryOnly: true})
  ],
  devtool: "inline-source-map"
}