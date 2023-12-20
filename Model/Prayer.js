const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Prayer = mongoose.model('Prayer', prayerSchema);

module.exports = Prayer;
