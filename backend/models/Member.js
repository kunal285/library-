const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: null,
  },
  membership_type: {
    type: String,
    default: 'Regular',
  },
  membership_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'Active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
