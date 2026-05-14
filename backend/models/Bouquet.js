const mongoose = require('mongoose');

const bouquetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: String,
  flowers: [{
    name: String,
    quantity: Number,
    pricePerUnit: Number
  }],
  totalPrice: Number,
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bouquet', bouquetSchema);
