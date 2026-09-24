// Import React and the tools needed to manage data
import React, { useEffect, useState } from 'react';

// Import Link to navigate between React pages
import { Link, useNavigate } from 'react-router-dom';


// Return the visual style for each donation status
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';

    case 'reserved':
      return 'bg-blue-50 text-blue-700 border border-blue-100';

    case 'pending':
      return 'bg-orange-50 text-orange-700 border border-orange-100';

    case 'approved':
      return 'bg-green-50 text-green-700 border border-green-100';

    case 'rejected':
      return 'bg-red-50 text-red-700 border border-red-100';

    case 'completed':
      return 'bg-gray-100 text-gray-700 border border-gray-200';

    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Convert the first letter of a status to uppercase
const formatStatus = (status) => {
  if (!status) return 'Unknown';

  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Convert the MongoDB date into a readable date
const formatDate = (date) => {
  if (!date) return 'No date';

  return new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function DonorDashboard() {
  // Store the donations received from the backend
  const [donations, setDonations] = useState([]);

  // Store whether the donations are still loading
  const [loading, setLoading] = useState(true);

  // Store an error message if something goes wrong
  const [error, setError] = useState('');

  // Get the logged-in user's information from the browser
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || 'User';

  // Create the user's initials from their name
  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Load the user's donations when the dashboard opens
  useEffect(() => {
    const loadDonations = async () => {
      try {
        // Get the authentication token saved during login
        const token = localStorage.getItem('token');

        // Request the logged-in user's donations from the backend
        const response = await fetch(
          'http://localhost:3010/api/donation-items/mine',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Convert the server response into a JavaScript object
        const data = await response.json();

        // Stop the process if the server returns an error
        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load donations'
          );
        }

        // Save the donations so React can display them
        setDonations(data.donationItems);
      } catch (error) {
        // Display an error message on the dashboard
        setError(error.message);
      } finally {
        // Stop displaying the loading message
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  // Calculate the dashboard statistics using real donation data
  const totalDonated = donations.length;

  // Count donations reserved for a receiver
  const itemsAllocated = donations.filter(
    (item) => item.status === 'reserved'
  ).length;

  // Count completed donations
  const completedItems = donations.filter(
    (item) => item.status === 'completed'
  ).length;

  // Create a navigation function
  const navigate = useNavigate();

  // Protect the route: Enforce role-based access
  useEffect(() => {
    // 1. If no user is logged in at all, kick them to the login page
    if (!user) {
      navigate('/login');
      return;
    }
    
    // 2. If the user is a Receiver, kick them back to the homepage
    if (user.role === 'receiver') {
      navigate('/');
    }
    
    // Admins and Donors will bypass these checks and stay on the page
  }, [user, navigate]);
  
    // Clear session data and refresh to show the logged-out state
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/'); 
    };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>
          <span className="text-xl font-bold tracking-tight">
            Givespace
          </span>
        </div>
      
        {/* Central Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">Home</Link>
          <Link to="/how-it-works" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">How It Works</Link>
          <Link to="/about-us" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">About Us</Link>        
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
            {initials}
          </div>
          <span className="text-sm font-semibold">
            {userName}
          </span>
          <Link 
              onClick={handleLogout}
              className="border border-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-md hover:bg-gray-50 hover:text-emerald-700 transition-colors"
            >
              Logout
            </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-2">
              Donor Portal
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Your donations
            </h1>

            <p className="text-gray-500 text-sm">
              Track and manage everything you've given.
            </p>
          </div>

          {/* Open the new donation form */}
          <Link
            to="/create-donation"
            className="bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm"
          >
            <span>+</span>
            Submit New Donation
          </Link>
        </div>

        {/* Display an error message if loading fails */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Statistics calculated from real donations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">
              {totalDonated}
            </p>

            <p className="text-xs text-gray-500 font-medium">
              Total Donated
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">
              {itemsAllocated}
            </p>

            <p className="text-xs text-gray-500 font-medium">
              Items Allocated
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">
              {completedItems}
            </p>

            <p className="text-xs text-gray-500 font-medium">
              Completed
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">
              0
            </p>

            <p className="text-xs text-gray-500 font-medium">
              Total Requests
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-3">
            All
          </button>

          <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 pb-3">
            Active
          </button>

          <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 pb-3">
            Completed
          </button>
        </div>

        {/* Donation table */}
        <div className="w-full">
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            <div className="col-span-5">
              Item
            </div>

            <div className="col-span-2">
              Category
            </div>

            <div className="col-span-2">
              Submitted
            </div>

            <div className="col-span-2">
              Status
            </div>

            <div className="col-span-1"></div>
          </div>

          {/* Display a message while the server is loading */}
          {loading && (
            <p className="py-6 text-gray-500">
              Loading donations...
            </p>
          )}

          {/* Display a message if the user has no donations */}
          {!loading && !error && donations.length === 0 && (
            <p className="py-6 text-gray-500">
              You have not submitted any donations yet.
            </p>
          )}

          <div className="flex flex-col">
            {/* Display every donation received from MongoDB */}
            {donations.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-50 px-2 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-5">
                  <p className="font-bold text-gray-900">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {item._id}
                  </p>
                </div>

                <div className="col-span-2 text-sm text-gray-600">
                  {item.category}
                </div>

                <div className="col-span-2 text-sm text-gray-600">
                  {formatDate(item.createdAt)}
                </div>

                <div className="col-span-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {formatStatus(item.status)}
                  </span>
                </div>

                <div className="col-span-1 text-right">
                  <button className="text-emerald-700 font-bold text-sm hover:underline">
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}