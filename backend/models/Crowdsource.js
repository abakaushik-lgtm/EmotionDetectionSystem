const mongoose = require('mongoose');

const crowdsourceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  proposedPrice: { type: Number, required: true },
  imageUrl: { type: String }, // In MVP, could be base64 or stored externally.
  imageBuffer: { type: Buffer }, // Storing directly for MVP simplicity
  status: { type: String, default: 'pending', enum: ['pending', 'training', 'approved', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crowdsource', crowdsourceSchema);
