const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donationItem: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationItem', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);