const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Check user online or offline
  status: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['Admin', 'User', 'Guest'], // 3 vai trò chính
    default: 'Guest',
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
