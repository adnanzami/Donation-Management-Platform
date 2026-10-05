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

// Get all available donations for the public Homepage
exports.getAvailableDonationItems = async (req, res) => {
  try {
    // CRITICAL: Filter explicitly for 'available' status
    const donationItems = await DonationItem.find({ status: 'available' })
      .populate('donorId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ donationItems });
  } catch (error) {
    console.error('Error fetching available items:', error);
    res.status(500).json({ message: 'Server error retrieving available items.' });
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

// Approve or reject a donation (Admin action)
exports.reviewDonationItem = async (req, res) => {
  try {
    // The frontend should pass { status: 'available' } or { status: 'rejected' } in the body
    const { status } = req.body; 

    // Validate the input to ensure it's a valid status
    if (!['available', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const updatedItem = await DonationItem.findByIdAndUpdate(
      req.params.id,
      { 
        status: status,
        reviewedBy: req.user._id, // Track which admin approved it
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Donation item not found.' });
    }

    res.status(200).json({ message: `Item successfully marked as ${status}.`, item: updatedItem });
  } catch (error) {
    console.error('Error reviewing item:', error);
    res.status(500).json({ message: 'Server error updating item status.' });
  }
};

// Get a single donation item by its ID
exports.getDonationItemById = async (req, res) => {
  try {
    const donationItem = await DonationItem.findById(req.params.id);
    
    if (!donationItem) {
      return res.status(404).json({ message: 'Donation item not found.' });
    }
    
    res.status(200).json({ donationItem });
  } catch (error) {
    console.error('Error fetching single donation:', error);
    
    // Catch invalid MongoDB ID formats
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation item not found.' });
    }
    
    res.status(500).json({ message: 'Server error retrieving the donation.' });
  }
};