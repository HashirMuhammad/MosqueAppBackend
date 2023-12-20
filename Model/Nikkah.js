const mongoose = require('mongoose');

const nikkahSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Nikkah = mongoose.model('Nikkah', nikkahSchema);

module.exports = Nikkah;
