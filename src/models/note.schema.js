const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteID: {
    type: String,
    required: true,
    unique: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: Map,
    of: String,
    required: true
  },
  title1: {
    type: Map,
    of: String,
  },
  title2: {
    type: Map,
    of: String,
  },
  title3: {
    type: Map,
    of: String,
  },
  desc: {
    type: Map,
    of: String,
  },
  desc1: {
    type: Map,
    of: String,
  },
  desc2: {
    type: Map,
    of: String,
  },
  desc3: {
    type: Map,
    of: String,
  },
  editorURI: {
    type: String,
  },
  imageURI: {
    type: String,
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);
