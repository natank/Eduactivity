const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDevelopment = false//process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    main: ["./src/main.js"]
  },
  mode: "development",
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "../dist"),
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
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader"
      }
      ]
    },
    {
      test: /\.module\.s(a|c)ss$/,
      loader: [
        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: isDevelopment
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDevelopment
          }
        }
      ]
    },
    {
      test: /\.s(a|c)ss$/,
      exclude: /\.module.(s(a|c)ss)$/,
      loader: [
        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: isDevelopment,
            config: {
              path: './config/postcss.config.js'
            }
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDevelopment
          }
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
          name: "images/[name].[ext]"
        }
      }]
    }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].css'
    }),
    new HTMLWebpackPlugin({
      template: "./src/views/shop/home.pug",
      filename: "home.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/views/admin/createCategory.pug",
      filename: "createCategory.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/views/admin/categories.pug",
      filename: "categories.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/views/admin/dashboard.pug",
      filename: "dashboard.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/views/shop/topic.pug",
      filename: "topic.html"
    }),
    new HTMLWebpackPlugin({
      template: "./src/views/shop/product.pug",
      filename: "product.html"
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  }
}