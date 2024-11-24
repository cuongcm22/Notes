const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {type: String, require: true},
  desc: {type: String},
  editorURI: {type: String, require: true, },
  imageURI: {type: String, default: ''},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);
