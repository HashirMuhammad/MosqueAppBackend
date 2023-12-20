const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  areaName: {
    type: String,
    required: true,
  },
  mosques: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mosque',
  }],
});

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;
