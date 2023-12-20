// models/qanda.js
const mongoose = require('mongoose');

const qAndASchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
});

const QandA = mongoose.model('QandA', qAndASchema);

module.exports = QandA;
