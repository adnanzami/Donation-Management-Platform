const mongoose = require('mongoose');

const donationItemSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    condition: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    images: {
      type: [String],
      default: []
    },
    location: {
      suburb: {
        type: String,
        required: true
      },
      postcode: {
        type: String,
        required: true
      }
    },
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'rejected',
        'available',
        'reserved',
        'completed'
      ],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewNote: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'donationItems'
  }
);

module.exports = mongoose.model('DonationItem', donationItemSchema);
