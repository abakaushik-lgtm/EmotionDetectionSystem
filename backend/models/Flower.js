const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, default: 0 },
  inventory: { type: Number, default: 100 } // Added for real-time inventory
});

module.exports = mongoose.model('Flower', flowerSchema);
