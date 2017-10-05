const path = require('path');
const webpack = require('webpack');
const fs = require("fs");

const license = fs.readFileSync(`./license.md`, "utf8");

module.exports = function(env) {
    return {
        context: path.resolve(__dirname, 'src'),

        target: 'web',

        entry: {
            'fsm': './main/fsm.js',
            'app': './index.js',
        },

        output: {
          path: path.resolve(__dirname, 'www'),
          filename: "[name].js",
        },

        module: {
            rules: [
              {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                }
              },
              {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                  loaders: {
                      'scss': 'vue-style-loader!css-loader!sass-loader',
                      'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                  }
              }
              }
            ]
        },

        resolve: {
            extensions: ['.js', '.vue', 'json'],
        },

        plugins: [
          new webpack.BannerPlugin({banner: license, entryOnly: true})
        ],
        devtool: "inline-source-map"
    }
}
