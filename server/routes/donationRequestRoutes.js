// Import Express to create the request routes
const express = require('express');


// Create the router
const router = express.Router();


// Import the donation request controller
const donationRequestController = require(
  '../controllers/donationRequestController'
);


// Import authentication middleware
const authMiddleware = require(
  '../middleware/authMiddleware'
);


// Import administrator middleware
const adminMiddleware = require(
  '../middleware/adminMiddleware'
);


// Get requests created by the logged-in Receiver
// GET http://localhost:3010/api/donation-requests/mine
router.get(
  '/mine',
  authMiddleware,
  donationRequestController.getMyDonationRequests
);


// Get requests waiting for Admin review
// GET http://localhost:3010/api/donation-requests/pending
router.get(
  '/pending',
  authMiddleware,
  adminMiddleware,
  donationRequestController.getPendingDonationRequests
);


// Create a new donation request
// POST http://localhost:3010/api/donation-requests
router.post(
  '/',
  authMiddleware,
  donationRequestController.createDonationRequest
);


// Approve or reject a donation request
// PATCH http://localhost:3010/api/donation-requests/:id/review
router.patch(
  '/:id/review',
  authMiddleware,
  adminMiddleware,
  donationRequestController.reviewDonationRequest
);


// Cancel a pending donation request
// PATCH http://localhost:3010/api/donation-requests/:id/cancel
router.patch(
  '/:id/cancel',
  authMiddleware,
  donationRequestController.cancelDonationRequest
);


// Export the router
module.exports = router;