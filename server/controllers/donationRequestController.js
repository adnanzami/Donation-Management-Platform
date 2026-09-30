// Import the models needed to manage donation requests
const DonationRequest = require(
  '../models/DonationRequest'
);

const DonationItem = require(
  '../models/DonationItem'
);


// Create a new donation request
exports.createDonationRequest = async (
  req,
  res
) => {
  try {
    // Only Receivers can request donations
    if (req.user.role !== 'Receiver') {
      return res.status(403).json({
        message:
          'Only receivers can request donations'
      });
    }

    const {
      donationItemId,
      justification
    } = req.body;


    // Validate the required information
    if (!donationItemId || !justification) {
      return res.status(400).json({
        message:
          'Donation item and justification are required'
      });
    }


    // Find the requested donation
    const donationItem =
      await DonationItem.findById(
        donationItemId
      );


    // Stop if the donation does not exist
    if (!donationItem) {
      return res.status(404).json({
        message: 'Donation item not found'
      });
    }


    // Only available items can be requested
    if (donationItem.status !== 'available') {
      return res.status(400).json({
        message:
          'This donation is no longer available'
      });
    }


    // Prevent duplicate active requests
    const existingRequest =
      await DonationRequest.findOne({
        donationItemId,
        receiverId: req.user.id,
        status: {
          $in: ['pending', 'approved']
        }
      });


    if (existingRequest) {
      return res.status(400).json({
        message:
          'You have already requested this donation'
      });
    }


    // Create the new request
    const donationRequest =
      new DonationRequest({
        donationItemId,
        receiverId: req.user.id,
        justification,
        status: 'pending'
      });


    // Save the request in MongoDB
    await donationRequest.save();


    // Return the created request
    res.status(201).json({
      message:
        'Donation request submitted successfully',
      donationRequest
    });
  } catch (error) {
    res.status(400).json({
      message:
        'Unable to create donation request',
      error: error.message
    });
  }
};


// Get requests created by the logged-in Receiver
exports.getMyDonationRequests = async (
  req,
  res
) => {
  try {
    // Only Receivers can view this information
    if (req.user.role !== 'Receiver') {
      return res.status(403).json({
        message:
          'Only receivers can view their requests'
      });
    }


    const donationRequests =
      await DonationRequest.find({
        receiverId: req.user.id
      })
        .populate({
          path: 'donationItemId',
          select:
            'title description category condition images location status'
        })
        .sort({
          createdAt: -1
        });


    res.status(200).json({
      donationRequests
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Unable to load donation requests',
      error: error.message
    });
  }
};


// Get all requests waiting for Admin review
exports.getPendingDonationRequests = async (
  req,
  res
) => {
  try {
    const donationRequests =
      await DonationRequest.find({
        status: 'pending'
      })
        .populate({
          path: 'receiverId',
          select: 'name email'
        })
        .populate({
          path: 'donationItemId',
          select:
            'title description category condition quantity location status'
        })
        .sort({
          createdAt: 1
        });


    res.status(200).json({
      donationRequests
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Unable to load pending requests',
      error: error.message
    });
  }
};


// Approve or reject a donation request
exports.reviewDonationRequest = async (
  req,
  res
) => {
  try {
    const requestId = req.params.id;

    const {
      status,
      reviewNote
    } = req.body;


    // The Admin can only approve or reject
    if (
      !['approved', 'rejected'].includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          'Status must be approved or rejected'
      });
    }


    // Find the request
    const donationRequest =
      await DonationRequest.findById(
        requestId
      );


    if (!donationRequest) {
      return res.status(404).json({
        message:
          'Donation request not found'
      });
    }


    // Only pending requests can be reviewed
    if (donationRequest.status !== 'pending') {
      return res.status(400).json({
        message:
          'This request has already been reviewed'
      });
    }


    const donationItem =
      await DonationItem.findById(
        donationRequest.donationItemId
      );


    if (!donationItem) {
      return res.status(404).json({
        message: 'Donation item not found'
      });
    }


    // The item must still be available
    if (
      status === 'approved' &&
      donationItem.status !== 'available'
    ) {
      return res.status(400).json({
        message:
          'This donation is no longer available'
      });
    }


    // Save the administrator's decision
    donationRequest.status = status;
    donationRequest.reviewedBy = req.user.id;
    donationRequest.reviewNote =
      reviewNote || null;

    await donationRequest.save();


    // Reserve the item when a request is approved
    if (status === 'approved') {
      donationItem.status = 'reserved';

      await donationItem.save();


      // Reject other pending requests for the item
      await DonationRequest.updateMany(
        {
          donationItemId:
            donationRequest.donationItemId,

          _id: {
            $ne: donationRequest._id
          },

          status: 'pending'
        },
        {
          $set: {
            status: 'rejected',
            reviewedBy: req.user.id,
            reviewNote:
              'Another request was approved for this item.'
          }
        }
      );
    }


    res.status(200).json({
      message:
        status === 'approved'
          ? 'Donation request approved successfully'
          : 'Donation request rejected successfully',

      donationRequest
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Unable to review donation request',
      error: error.message
    });
  }
};


// Cancel a pending request
exports.cancelDonationRequest = async (
  req,
  res
) => {
  try {
    const donationRequest =
      await DonationRequest.findOne({
        _id: req.params.id,
        receiverId: req.user.id
      });


    if (!donationRequest) {
      return res.status(404).json({
        message:
          'Donation request not found'
      });
    }


    // Only pending requests can be cancelled
    if (donationRequest.status !== 'pending') {
      return res.status(400).json({
        message:
          'Only pending requests can be cancelled'
      });
    }


    donationRequest.status = 'cancelled';

    await donationRequest.save();


    res.status(200).json({
      message:
        'Donation request cancelled successfully',

      donationRequest
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Unable to cancel donation request',
      error: error.message
    });
  }
};