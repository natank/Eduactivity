const path = require('path');
const Category = require('../models/Category');
const Topic = require('../models/Topic');
const Product = require('../models/Product');

exports.getHome = async function (req, res, next) {
  
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
}

exports.getTopic = async function (req, res, next) {
  try{
    const topic = await Topic.findById(req.params.id);
    const products = await Product.find({topic: req.params.id});

    res.render('./shop/topic', {topic: topic, products: products})
  } catch(err){
    next(err)
  }
    
}

exports.getProduct = async function (req, res, next) {
  try{

  }catch(err){
    next(err)
  }
  const prodId = req.params.id;
  const product = 
  res.sendFile(path.resolve(__dirname, '../../dist/product.html'))
}