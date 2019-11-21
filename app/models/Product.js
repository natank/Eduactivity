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
  imageName: {
    type: String,
    required: true
  },
  printableName: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  }

})

module.exports = mongoose.model('Product', productSchema);