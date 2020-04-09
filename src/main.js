require("bootstrap");
require("./styles/main.scss");
require("bootstrap");
require("./scripts/index.js");
console.log(`Environment is ${process.env.NODE_ENV}`);

const globalVar = true;
const something = function (someArgument) {
  const longVariableName = someArgument;
  const result = function (longVariableName) {
    return logVariableName * longVariableName + globalVar
  }
}