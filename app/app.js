import express from "express";
import path from 'path';
import session from 'express-session';
import multipartExtract from './middleware/multipartExtract';
import webpack from 'webpack';
import User from './models/User';
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const mongoConnect = require('./util/database').mongoConnect;
const MONGODB_URI = require('./util/database').dbURI;
const bodyParser = require('body-parser');
const config = require("../config/webpack.dev.js");
const flash = require('connect-flash');
const compiler = webpack(config);
const webpackDevMiddleware = require("webpack-dev-middleware")(
  compiler,
  {
    writeToDisk: (filePath) => {
      // instruct the dev server to the home.html file to disk 
      // so that the route handler will be able to read it 
      return /.+\.css$/.test(filePath);
    }
  }
)

const webpackHotMiddleware = require("webpack-hot-middleware")(compiler);
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");


/**
 * 
 *  global app variables 
 * 
 * */
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

/**
 * 
 * Session middleware
 * 
 */

const sessionMW = (function (app) {
  //Define session middleware
  app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
})(app)

/**
 * data middleware
 */
const dataMW = (function (app) {
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(
    bodyParser.json()
  )
})(app)


/**
 * multipart middleware
 */

app.post('*', multipartExtract)

/**
 * Webpack middleware
 */

const webpackMW = (function (app) {
  app.use(webpackDevMiddleware);
  app.use(webpackHotMiddleware);
})(app)

/**
 * 
 * General Middleware
 * 
 */

const generalMW = (function (app) {
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, "../src/views"))
  app.use(express.static(path.join(__dirname, '../dist')));
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use(flash());
})(app)

/**
 * 
 * csrf Middleware
 * 
 */

const csrfMW = (function (app) {

  app.use(csrfProtection);
})(app)


const localsMW = (function (app) {
  app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  })
})(app)

const userMW = (function (app) {
  app.use(async (req, res, next) => {
    if (req.session.user) {
      try {
        let user = await User.findById(req.session.user._id);

        if (user) {
          req.user = user;
          res.locals.user = user.email
        }
      } catch (err) {
        throw new Error(err);
      }
    }
    next();
  });
})(app)

const endPointsMW = (function (app) {
  app.use('/', shopRoutes)
  app.use('/shop', shopRoutes)
  app.use('/admin', adminRoutes)
  app.use('/auth', authRoutes)
})(app)

app.use((req, res, next) => {
  console.log('endpoints mw done')
  next()
})



const connect = (async function (app) {
  await mongoConnect();
  app.listen(8080, () => {
    console.log("app is listening")
  })
})(app)
