const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
  },
  publisher: {
    type: String,
  },
  genre: {
    type: String,
    required: true,
  },
  published_year: {
    type: Number,
    required: true,
  },
  total_copies: {
    type: Number,
    default: 0,
  },
  available_copies: {
    type: Number,
    default: 0,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
