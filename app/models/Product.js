const mongoose = require('mongoose');

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

const Product = mongoose.model('Product', productSchema);
productSchema.pre('deleteMany', async function (next) {
  // Delete related products
  const topicId = this.getQuery().topic;
  const products = await Product.find({ topic: topicId });
  const productsPromise = products.map(product => {
    const { imageUrl } = { ...product };
    const imageName = imageUrl.split('/').pop();
    const imageDir = "images";
    const imagePath = `${imageDir}/${imageName}`;
    return s3.deleteFile(imagePath)
  });
  promise.all(productsPromise);
})

module.exports = Product;
