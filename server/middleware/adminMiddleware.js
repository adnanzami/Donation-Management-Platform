// Check whether the logged-in user is an administrator
const adminMiddleware = (req, res, next) => {
  // Stop the request if the token does not contain user information
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  // Stop the request if the user is not an administrator
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      message: 'Administrator access required'
    });
  }

  // Continue to the controller if the user is an administrator
  next();
};

// Export the middleware so the routes can use it
module.exports = adminMiddleware;