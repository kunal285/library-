const mongoose = require('mongoose');

const issuedBookSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null,
  },
  issue_date: {
    type: Date,
    required: true,
  },
  due_date: {
    type: Date,
    default: null,
  },
  return_date: {
    type: Date,
    default: null,
  },
  fine_amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'Issued',
  },
}, { timestamps: true });

module.exports = mongoose.model('IssuedBook', issuedBookSchema);
