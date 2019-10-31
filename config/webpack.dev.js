const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin")
const chokidar = require('chokidar');

module.exports = {
  entry: {
    main: ["./src/main.js"]
  },
  mode: "development",
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "../src/server/dist"),
    publicPath: "/"
  },
  devServer: {
    contentBase: "dist",
    hot: true,
    open: true,
    progress: true,
    stats: {
      colors: true
    }
  },
  devtool: "source-map",
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader"
      }],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: [{
        loader: "style-loader"
      },
      {
        loader: "css-loader"
      }
      ]
    },
    {
      test: /\.html$/,
      use: [{
        loader: "html-loader",
        options: {
          attrs: ["img:src"]
        }
      }]
    },
    {
      test: /\.pug$/,
      use: [{
        loader: "pug-loader"
      }]
    },
    {
      test: /\.(jpg|gif|png)$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "images/[name]-[hash:8].[ext]"
        }
      }]
    }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      template: "./src/index.pug",
      filename: "home.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/server/views/admin/createProduct.pug",
      filename: "createProduct.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/server/views/admin/createTopic.pug",
      filename: "createTopic.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/server/views/admin/createCategory.pug",
      filename: "createCategory.html"
    })
  ]
}