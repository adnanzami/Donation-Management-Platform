const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Import your controller
const requestController = require('../controllers/requestController');

// POST /api/requests
// Create a new request for an available item (Receiver action)
router.post('/', authMiddleware, requestController.createRequest);

// GET /api/requests/mine
// Get all requests made by the logged-in user (ReceiverDashboard tab)
router.get('/mine', authMiddleware, requestController.getMyRequests);

// GET /api/requests/pending
// Get all pending requests across the platform (AdminDashboard tab)
router.get('/pending', authMiddleware, adminMiddleware, requestController.getAllPendingRequests);

// PATCH /api/requests/:id/approve
// Approve a specific request and assign the item (Admin action)
router.patch('/:id/approve', authMiddleware, adminMiddleware, requestController.approveRequest);

// PATCH /api/requests/:id/reject
// Deny a specific request (Admin action)
router.patch('/:id/reject', authMiddleware, adminMiddleware, requestController.rejectRequest);

module.exports = router;