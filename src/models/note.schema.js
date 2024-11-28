const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteID: {
    type: String, require: true, unique: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {type: String},
  title1: {type: String},
  title2: {type: String},
  title3: {type: String},
  desc: {type: String},
  desc1: {type: String},
  desc2: {type: String},
  desc3: {type: String},
  editorURI: {type: String},
  imageURI: {type: String},
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);
