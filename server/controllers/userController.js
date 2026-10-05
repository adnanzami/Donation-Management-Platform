const User = require('../models/User'); // Adjust path to your User model

// Fetch all registered users for the Admin table
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users, but exclude their passwords from the result for security
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error retrieving users.' });
  }
};

// Elevate a standard user to an Admin role
exports.updateUserRole = async (req, res) => {
  try {
    // You could pass the exact role in the request body, or hardcode it to Admin
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'Admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User role updated successfully.', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error updating user role.' });
  }
};