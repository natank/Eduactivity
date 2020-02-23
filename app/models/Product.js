const mongoose = require('mongoose');
const s3 = require('../util/aws-s3');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  printableUrl: {
    type: String,
    required: true
  },
  topic: {
    type: ObjectId,
    ref: 'Topic',
    required: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
});

productSchema.pre('deleteMany', async function (next) {
  // Delete related products
  const topicId = this.getQuery().topic;
  try {
    const products = await Product.find({ topic: topicId });
    const productsPromise = products.map(product => {
      const { imageUrl } = { ...product.toObject() };
      const imageName = imageUrl.split('/').pop();
      const imageDir = "images";
      const imagePath = `${imageDir}/${imageName}`;
      return s3.deleteFile(imagePath)
    });
    Promise.all(productsPromise);
  } catch (err) {
    next(err)
  }
})
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
