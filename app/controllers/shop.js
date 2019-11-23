const path = require('path');
const Category = require('../models/Category');
const Topic = require('../models/Topic');

exports.getHome = async function (req, res, next) {
  console.log("get index");
  try {
    const categories = await Category.find({}, 'title')
    let topicsPerCategoryPromise = categories.map(category => {
      return Topic.find({ category: category.id }, "title").exec()
    })
    let topicsPerCategory = await Promise.all(topicsPerCategoryPromise)
    let data = topicsPerCategory.map((topics, index) => {
      let entry = {
        category: categories[index],
        topics: topics
      }
      return entry
    })
    res.render('./shop/index', { data: data })
  } catch (err) {
    next(err)
  }
  // res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
}

exports.getTopic = function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '../../dist/topic.html'))
}

exports.getProduct = function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '../../dist/product.html'))
}