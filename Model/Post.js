const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  mosqueid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mosque',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
