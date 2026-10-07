import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Placeholder state for data you will fetch from the backend
  const [users, setUsers] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
    }

    loadPendingData();
  }, [
    token,
    userRole,
    navigate,
    loadPendingData,
  ]);

  // Approve or reject a donation item
  const reviewDonation = async (
    donationId,
    newStatus
  ) => {
    try {
      setReviewingId(`donation-${donationId}`);
      setError('');
      setSuccess('');

      const response = await fetch(
        `http://localhost:3010/api/donation-items/${donationId}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            reviewNote:
              donationNotes[donationId] || '',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to review donation.'
        );
      }

      // Remove the reviewed donation from the pending list
      setDonations((currentDonations) =>
        currentDonations.filter(
          (item) => item._id !== donationId
        )
      );

      setSuccess(
        data.message ||
          `The donation was ${
            newStatus === 'available'
              ? 'approved'
              : 'rejected'
          }.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewingId('');
    }
  };

  // Approve or reject a Receiver's donation request
  const reviewRequest = async (
    requestId,
    newStatus
  ) => {
    try {
      setReviewingId(`request-${requestId}`);
      setError('');
      setSuccess('');

      const response = await fetch(
        `http://localhost:3010/api/donation-requests/${requestId}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            reviewNote:
              requestNotes[requestId] || '',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to review the donation request.'
        );
      }

      // Remove the reviewed request from the pending list
      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) => request._id !== requestId
        )
      );

      setSuccess(
        data.message ||
          `The donation request was ${newStatus}.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewingId('');
    }
  };

  // Clear the login information
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Fetch Admin Data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all users
        const usersRes = await fetch('http://localhost:3010/api/users', { headers });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }

        // Fetch pending donation listings (Record Officer role)
        const donationsRes = await fetch('http://localhost:3010/api/donation-items/pending', { headers });
        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setPendingDonations(donationsData.donationItems || []);
        }

        // Fetch pending receiver requests
        const requestsRes = await fetch('http://localhost:3010/api/requests/pending', { headers });
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setPendingRequests(requestsData.requests || []);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to connect to the database. Check your backend server.');
      }
    };

   // Only fetch if the user is a verified admin
   if (user && user.role === 'Admin') {
    fetchAdminData();
  }
  }, [user]);

  // Example functions for Admin actions (Requires corresponding Express backend routes)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3010/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }) 
      });

      if (response.ok) {
        // Update the local state so the UI reflects the change immediately
        setUsers(prevUsers => 
          prevUsers.map(u => u._id === userId ? { ...u, role: newRole } : u)
        );
        alert(`User successfully updated to ${newRole}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update role: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error changing user role:', err);
    }
  };

  const handleApproveDonation = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3010/api/donation-items/${itemId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'available' }) // CRITICAL: Send the new status
      });

      if (response.ok) {
        // Remove the approved item from the local pending list so it disappears from the screen
        setPendingDonations(prev => prev.filter(item => item._id !== itemId));
        alert('Donation approved and published to homepage!');
      } else {
        const errorData = await response.json();
        alert(`Failed to approve: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error approving donation:', err);
    }
  };

  const handleApproveRequest = async (requestId) => {
    alert(`Backend route needed: PATCH /api/requests/${requestId}/approve`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-2">Record Officer / Admin Portal</p>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">System Administration</h1>
            <p className="text-gray-500 text-sm">Manage users, approve donation listings, and oversee item requests.</p>
          </div>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
          <button onClick={() => setActiveTab('users')} className={`text-sm font-bold pb-3 whitespace-nowrap ${activeTab === 'users' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}>
            Manage Users
          </button>
          <button onClick={() => setActiveTab('donations')} className={`text-sm font-bold pb-3 whitespace-nowrap ${activeTab === 'donations' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}>
            Review Listings (Donors)
          </button>
          <button onClick={() => setActiveTab('requests')} className={`text-sm font-bold pb-3 whitespace-nowrap ${activeTab === 'requests' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}>
            Review Requests (Receivers)
          </button>
        </div>

        <div className="w-full">
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold">Registered Users</h2>
                <input type="text" placeholder="Search users..." className="px-4 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div className="p-6 flex flex-col gap-4">
                {users.length === 0 && <p className="text-gray-500">No users found.</p>}
                {users.map((dbUser) => (
                  <div key={dbUser._id} className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <div>
                      <p className="font-bold">{dbUser.name}</p>
                      <p className="text-xs text-gray-500">{dbUser.email} • Current Role: {dbUser.role}</p>
                    </div>
                    
                    {/* Role Selector Dropdown */}
                    <select 
                      value={dbUser.role} 
                      onChange={(e) => handleRoleChange(dbUser._id, e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-sm font-semibold px-3 py-1.5 rounded outline-none focus:border-emerald-700"
                    >
                      <option value="Donor">Donor</option>
                      <option value="Receiver">Receiver</option>
                      <option value="Admin">Admin</option>
                    </select>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donation Approvals (Record Officer Task) */}
          {activeTab === 'donations' && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold">Pending Donation Listings</h2>
                <p className="text-gray-500 text-sm">Review physical items submitted by donors before making them public.</p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {pendingDonations.length === 0 && <p className="text-gray-500">No pending donations to review.</p>}
                
                {pendingDonations.map((item) => (
                  <div key={item._id} className="flex justify-between items-center pb-4 border-b border-gray-50">
                    
                    {/* --- NEW: Image and Description Block --- */}
                    <div className="flex gap-4 w-3/4">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold bg-emerald-50">N/A</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{item.title} <span className="text-sm font-normal text-gray-500 ml-1">({item.condition})</span></p>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">{item.description}</p>
                        <p className="text-xs text-emerald-700 font-semibold mt-1">Category: {item.category}</p>
                      </div>
                    </div>
                    {/* -------------------------------------- */}

                    <div className="flex gap-2">
                      <button onClick={() => handleApproveDonation(item._id)} className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded hover:bg-emerald-800">Approve</button>
                      <button className="bg-red-50 text-red-700 text-xs font-bold px-4 py-2 rounded hover:bg-red-100">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Request Approvals */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold">Pending Item Requests</h2>
                <p className="text-gray-500 text-sm">Review requests from receivers who want to claim an available item.</p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {pendingRequests.length === 0 && (
                  <p className="text-gray-500">No pending item requests to review.</p>
                )}
                {pendingRequests.map((request) => (
                  <div key={request._id} className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <div>
                      <p className="font-bold">
                        Request for: {request.donationItem?.title || 'Unknown Item'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Requested by: {request.receiver?.name || 'Unknown Receiver'} • {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveRequest(request._id)} 
                        className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded hover:bg-emerald-800"
                      >
                        Approve Request
                      </button>
                      <button 
                        className="bg-red-50 text-red-700 text-xs font-bold px-4 py-2 rounded hover:bg-red-100"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 