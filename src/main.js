require("babel-runtime/regenerator");
require("bootstrap");
require("webpack-hot-middleware/client?reload=true");
require("./styles/main.scss");

require('https://js.stripe.com/v3/')
require('./scripts/stripe');