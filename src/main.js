require("babel-runtime/regenerator");
require("webpack-hot-middleware/client");
require("./main.css");
var index = require("./index.html");


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