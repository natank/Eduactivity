console.log(`Environment is ${process.env.NODE_ENV}`);
require("@babel/register");
require('dotenv').config();
require("./app");