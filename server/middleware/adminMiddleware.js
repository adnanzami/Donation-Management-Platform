const adminMiddleware = (req, res, next) => {
  // Ensure the user exists and their role is exactly 'Admin'
  if (req.user && req.user.role === 'Admin') {
    next(); // Allowed
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = adminMiddleware;