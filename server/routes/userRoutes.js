const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Import your controller
const userController = require('../controllers/userController');

// GET /api/users
// Fetch all registered users for the Admin table
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

// PATCH /api/users/:id/role
// Elevate a standard user to an Admin role
router.patch('/:id/role', authMiddleware, adminMiddleware, userController.updateUserRole);

module.exports = router;