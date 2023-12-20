const mongoose = require('mongoose');

const mosqueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
});


const Mosque = mongoose.model('Mosque', mosqueSchema);

module.exports = Mosque;
