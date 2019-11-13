const path = require('path');
exports.getHome = function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '../../dist/home.html'))
}

exports.getTopic = function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '../../dist/topic.html'))
}

exports.getProduct = function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '../../dist/product.html'))
}