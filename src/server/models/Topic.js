const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const topicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  products: {
    type: [{
      type: ObjectId,
      ref: 'Product',
      required: true
    }],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  }

})

module.exports = mongoose.model('Topic', topicSchema);