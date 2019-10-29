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
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin")


server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);
server.use
const staticMiddleware = express.static("/dist");
server.use(staticMiddleware);

server.use('/', shopRoutes)
server.use('/admin', adminRoutes)


server.listen(8080, () => {
  console.log("Server is listening")
})