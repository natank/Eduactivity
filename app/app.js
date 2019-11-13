import express from "express";
import path from 'path';
const mongoConnect = require('./util/database').mongoConnect;
const MONGODB_URI = require('./util/database').dbURI;
const bodyParser = require('body-parser');
const webpack = require("webpack");
const config = require("../config/webpack.dev.js");

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

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(
  bodyParser.json()
)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "../src/views"))
app.use(webpackDevMiddleware);
app.use(webpackHotMiddleware);

app.use(express.static("/dist"));

app.use('/', shopRoutes)
app.use('/admin', adminRoutes)


const connect = (async function (app) {
  await mongoConnect();
  app.listen(8080, () => {
    console.log("app is listening")
  })
})(app)