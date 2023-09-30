const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  // Ajoutez cette option pour inclure la propriété "id" dans les documents
  toJSON: {
    virtuals: true
  }
});

// Définissez le champ virtuel "id"
ProductSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
