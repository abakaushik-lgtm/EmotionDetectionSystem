const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bouquetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bouquet', required: false },
  flowers: [{
    name: String,
    quantity: Number,
    pricePerUnit: Number
  }],
  totalPrice: Number,
  deliveryOption: String,
  deliveryAddress: String,
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed', 'shipped', 'delivered'] },
  stripeSessionId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
