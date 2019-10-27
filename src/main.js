require("babel-runtime/regenerator");
require("webpack-hot-middleware/client?reload=true");

require("./main.css");
var index = require("./index.html");
debugger

var a = async (args) => {
  const {
    a,
    b
  } = args;
  try {

    await console.log("Hello from the future!", a, b)
  } catch (err) {
    throw (err)
  }
  console.log("done")
}

a({
  a: 1,
  b: 2
})