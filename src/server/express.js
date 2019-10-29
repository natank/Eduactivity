import express from "express";
import path from "path";

const server = express();

const webpack = require("webpack");
const config = require("../../config/webpack.dev.js");
const compiler = webpack(config);

const webpackDevMiddleware = require("webpack-dev-middleware")(
  compiler,
  {
    writeToDisk: (filePath) => {
      // instruct the dev server to the home.html file to disk 
      // so that the route handler will be able to read it 
      return /.+\.html$/.test(filePath);
    }
  }
  // config.devServer,

)
const webpackHotMiddleware = require("webpack-hot-middleware")(compiler);

server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);

const staticMiddleware = express.static("/dist");
server.use(staticMiddleware);

server.get('', (req, res, next) => {
  debugger
  res.sendFile(__dirname + '/dist/home.html')
})

server.listen(8080, () => {
  console.log("Server is listening")
})