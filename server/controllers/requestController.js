const Request = require('../models/Request'); // Adjust path to your Request model if needed
const DonationItem = require('../models/DonationItem'); // Adjust path to your DonationItem model

// Create a new request for an available item (Receiver action)
exports.createRequest = async (req, res) => {
  try {
    const { donationItemId, justification } = req.body;

    // Optional: Check if the item is still available
    const item = await DonationItem.findById(donationItemId);
    if (!item || item.status !== 'available') {
      return res.status(400).json({ message: 'This item is no longer available.' });
    }

    const newRequest = await Request.create({
      donationItem: donationItemId,
      receiver: req.user._id, // Set by your authMiddleware
      justification: justification || '',
      status: 'pending'
    });

    res.status(201).json({ request: newRequest });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Server error creating request.' });
  }
};

// Get all requests made by the logged-in user (ReceiverDashboard)
exports.getMyRequests = async (req, res) => {
  try {
    // Find requests where the receiver matches the logged-in user
    const requests = await Request.find({ receiver: req.user._id })
      .populate('donationItem', 'title category condition') // Pull in item details
      .sort({ createdAt: -1 });

    // Map the populated data to match what the React frontend expects (req.itemTitle)
    const formattedRequests = requests.map(req => ({
      _id: req._id,
      itemTitle: req.donationItem ? req.donationItem.title : 'Item Removed',
      status: req.status,
      createdAt: req.createdAt
    }));

    res.status(200).json({ requests: formattedRequests });
  } catch (error) {
    console.error('Error fetching receiver requests:', error);
    res.status(500).json({ message: 'Server error retrieving your requests.' });
  }
};

// Get all pending requests across the platform (AdminDashboard)
exports.getAllPendingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'pending' })
      .populate('donationItem', 'title')
      .populate('receiver', 'name email');
      
    res.status(200).json({ requests });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Server error retrieving pending requests.' });
  }
};

// Approve a specific request and assign the item (Admin action)
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'approved';
    await request.save();

    // Update the corresponding item to show it has been allocated
    await DonationItem.findByIdAndUpdate(request.donationItem, { status: 'allocated' });

    // Optional: Auto-reject other pending requests for this same item here

    res.status(200).json({ message: 'Request approved successfully', request });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Server error approving request.' });
  }
};

// Deny a specific request (Admin action)
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id, 
      { status: 'rejected' }, 
      { new: true }
    );

    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.status(200).json({ message: 'Request denied successfully', request });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Server error rejecting request.' });
  }
};