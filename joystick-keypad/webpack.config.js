const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const SRC_DIR = path.join(__dirname, 'src');
module.exports = {
  entry: path.join(SRC_DIR, 'app.tsx'),
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    contentBase: SRC_DIR,
  },
  resolve: {
    alias: {
      src: SRC_DIR,
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new webpack.SourceMapDevToolPlugin({
      test: /\.(ts|js)($|\?)/i
    }),
    new ReactRefreshWebpackPlugin()
  ]
};