// Import Express to create the donation routes
const express = require('express');

// Create a router for donation-related requests
const router = express.Router();

// Import the controller that contains the donation functions
const donationItemController = require(
  '../controllers/donationItemController'
);

// Import the middleware that verifies the user's token
const authMiddleware = require(
  '../middleware/authMiddleware'
);

// Import the middleware that verifies the administrator role
const adminMiddleware = require(
  '../middleware/adminMiddleware'
);

// Get all available donations
// This route is public and does not require a token
// GET http://localhost:3010/api/donation-items/available
router.get(
  '/available',
  donationItemController.getAvailableDonationItems
);

// Get donations waiting for administrator review
// Only administrators can use this route
// GET http://localhost:3010/api/donation-items/pending
router.get(
  '/pending',
  authMiddleware,
  adminMiddleware,
  donationItemController.getPendingDonationItems
);

// Get donations created by the logged-in user
// GET http://localhost:3010/api/donation-items/mine
router.get(
  '/mine',
  authMiddleware,
  donationItemController.getMyDonationItems
);

// Create a new donation
// POST http://localhost:3010/api/donation-items
router.post(
  '/',
  authMiddleware,
  donationItemController.createDonationItem
);

// Approve or reject a donation
// Only administrators can use this route
// PATCH http://localhost:3010/api/donation-items/:id/review
router.patch(
  '/:id/review',
  authMiddleware,
  adminMiddleware,
  donationItemController.reviewDonationItem
);

// Export the router so server.js can use it
module.exports = router;