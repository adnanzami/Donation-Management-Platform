// Import the DonationItem model to work with donation data
const DonationItem = require('../models/DonationItem');

// Create and save a new donation
exports.createDonationItem = async (req, res) => {
  try {
    // Get the donation information sent by the frontend
    const {
      title,
      description,
      category,
      condition,
      quantity,
      images,
      location
    } = req.body;

    // Create a new donation object
    const donationItem = new DonationItem({
      // Get the donor's ID from the verified token
      donorId: req.user.id,
      title,
      description,
      category,
      condition,
      quantity,

      // Use an empty array if no images were provided
      images: images || [],

      location,

      // Every new donation must wait for administrator approval
      status: 'pending'
    });

    // Save the new donation in MongoDB
    await donationItem.save();

    // Return the created donation
    res.status(201).json({
      message: 'Donation item created successfully',
      donationItem
    });
  } catch (error) {
    // Return an error if the donation cannot be created
    res.status(400).json({
      message: 'Unable to create donation item',
      error: error.message
    });
  }
};

// Get donations created by the logged-in user
exports.getMyDonationItems = async (req, res) => {
  try {
    // Find donations that belong to the logged-in user
    const donationItems = await DonationItem.find({
      donorId: req.user.id
    }).sort({
      // Display the newest donations first
      createdAt: -1
    });

    // Return the user's donations
    res.status(200).json({
      donationItems
    });
  } catch (error) {
    // Return an error if the donations cannot be loaded
    res.status(500).json({
      message: 'Unable to load donation items',
      error: error.message
    });
  }
};

// Get all donations that are available to receivers
exports.getAvailableDonationItems = async (req, res) => {
  try {
    // Find only donations approved and marked as available
    const donationItems = await DonationItem.find({
      status: 'available'
    })
      // Include the donor's name without including private information
      .populate('donorId', 'name')
      // Display the newest donations first
      .sort({ createdAt: -1 });

    // Return the available donations
    res.status(200).json({
      donationItems
    });
  } catch (error) {
    // Return an error if the available donations cannot be loaded
    res.status(500).json({
      message: 'Unable to load available donation items',
      error: error.message
    });
  }
};

// Get all donations waiting for administrator review
exports.getPendingDonationItems = async (req, res) => {
  try {
    // Find only donations with a pending status
    const donationItems = await DonationItem.find({
      status: 'pending'
    })
      // Include the donor's name and email in the administrator response
      .populate('donorId', 'name email')
      // Display the oldest donations first
      .sort({ createdAt: 1 });

    // Return the pending donations
    res.status(200).json({
      donationItems
    });
  } catch (error) {
    // Return an error if the donations cannot be loaded
    res.status(500).json({
      message: 'Unable to load pending donation items',
      error: error.message
    });
  }
};

// Approve or reject a pending donation
exports.reviewDonationItem = async (req, res) => {
  try {
    // Get the donation ID from the route
    const donationId = req.params.id;

    // Get the new status and review note from the request
    const { status, reviewNote } = req.body;

    // Only allow the administrator to make an item available or rejected
    if (!['available', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be available or rejected'
      });
    }

    // Find the donation by its ID
    const donationItem = await DonationItem.findById(donationId);

    // Stop if the donation does not exist
    if (!donationItem) {
      return res.status(404).json({
        message: 'Donation item not found'
      });
    }

    // Only pending donations can be reviewed
    if (donationItem.status !== 'pending') {
      return res.status(400).json({
        message: 'This donation has already been reviewed'
      });
    }

    // Save the administrator's decision
    donationItem.status = status;

    // Save the administrator's user ID
    donationItem.reviewedBy = req.user.id;

    // Save the optional explanation
    donationItem.reviewNote = reviewNote || null;

    // Save the changes in MongoDB
    await donationItem.save();

    // Return the updated donation
    res.status(200).json({
      message:
        status === 'available'
          ? 'Donation item approved successfully'
          : 'Donation item rejected successfully',
      donationItem
    });
  } catch (error) {
    // Return an error if the donation cannot be reviewed
    res.status(500).json({
      message: 'Unable to review donation item',
      error: error.message
    });
  }
};