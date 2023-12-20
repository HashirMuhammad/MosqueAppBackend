const mongoose = require('mongoose');

const duaSchema = new mongoose.Schema({
  dua: {
    type: String,
    required: true,
  },
});

const Dua = mongoose.model('Dua', duaSchema);

module.exports = Dua;
