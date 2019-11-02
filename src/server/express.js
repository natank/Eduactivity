import express from "express";
const mongoConnect = require('./util/database').mongoConnect;
const MONGODB_URI = require('./util/database').dbURI;

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
)

const webpackHotMiddleware = require("webpack-hot-middleware")(compiler);
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin")

const server = express();

server.set('view engine', 'pug')

server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);

const staticMiddleware = express.static("/dist");
server.use(staticMiddleware);

server.set
server.use('/', shopRoutes)
server.use('/admin', adminRoutes)


const connect = (async function (server) {
  await mongoConnect();
  server.listen(8080, () => {
    console.log("Server is listening")
  })
})(server)