// Import Mongoose to create the MongoDB schema
const mongoose = require('mongoose');


// Create the structure of a donation request
const donationRequestSchema = new mongoose.Schema(
  {
    // Donation item requested by the receiver
    donationItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonationItem',
      required: true
    },

    // User who requested the donation
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Explanation provided by the receiver
    justification: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500
    },

    // Current status of the request
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'rejected',
        'cancelled',
        'completed'
      ],
      default: 'pending'
    },

    // Administrator who reviewed the request
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Optional explanation from the administrator
    reviewNote: {
      type: String,
      trim: true,
      default: null
    },

    // Date when the donation was completed
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    // Automatically create createdAt and updatedAt
    timestamps: true,

    // Set the MongoDB collection name
    collection: 'donationRequests'
  }
);


// Export the model so controllers can use it
module.exports = mongoose.model(
  'DonationRequest',
  donationRequestSchema
);