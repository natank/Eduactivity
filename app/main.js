const path = require('path');
console.log(`Environment is ${process.env.NODE_ENV}`);
require("@babel/register");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, "../config/vars") });
  console.log(`read configuration file from ${path.join(__dirname, "../config")}`)
}
require("./app");