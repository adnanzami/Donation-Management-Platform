import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'available': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'reserved': return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'pending': return 'bg-orange-50 text-orange-700 border border-orange-100';
    case 'approved': return 'bg-green-50 text-green-700 border border-green-100';
    case 'rejected': return 'bg-red-50 text-red-700 border border-red-100';
    case 'completed': return 'bg-gray-100 text-gray-700 border border-gray-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (date) => {
  if (!date) return 'No date';
  return new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function ViewDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (e) {
      console.error("Failed to parse user data from local storage.");
      return null;
    }
  });

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(`http://localhost:3010/api/donation-items/${id}`, {
          method: 'GET',
          headers
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load donation details');
        }

        setItem(data.donationItem || data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [id]);

  const handleAdminApproval = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3010/api/donation-items/${id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setItem({ ...item, status: newStatus });
        alert(`Item successfully ${newStatus}!`);
      } else {
        const data = await response.json();
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    }
  };

  const handleReceiverRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3010/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ donationItemId: id })
      });

      if (response.ok) {
        alert('Request submitted! The Admin will review your claim.');
        // Update the item status locally so the button instantly changes to Pending
        setItem({ ...item, status: 'pending' });
      } else {
        const data = await response.json();
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    }
  };

  const renderActionButtons = () => {
    if (!user) {
      return (
        <button onClick={() => navigate('/login')} className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 transition-colors">
          Log in to interact
        </button>
      );
    }

    const role = user.role?.toLowerCase();

    // 1. Admin View (Approve or Reject Listings)
    if (role === 'admin') {
      if (item.status === 'pending') {
        return (
          <div className="flex gap-3 w-full">
            <button onClick={() => handleAdminApproval('available')} className="flex-1 bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 transition-colors">
              Approve Listing
            </button>
            <button onClick={() => handleAdminApproval('rejected')} className="flex-1 bg-red-50 text-red-700 border border-red-100 font-bold py-3 px-4 rounded-md hover:bg-red-100 transition-colors">
              Reject Listing
            </button>
          </div>
        );
      }
      return (
        <button disabled className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-md cursor-not-allowed">
          Admin: Status is {formatStatus(item.status)}
        </button>
      );
    }

    // 2. Donor View (Edit or Delete their own listings)
    if (role === 'donor') {
      if (item.status === 'pending' || item.status === 'available') {
        return (
          <div className="flex gap-3 w-full">
            <button className="flex-1 border border-emerald-700 text-emerald-700 font-bold py-3 px-4 rounded-md hover:bg-emerald-50 transition-colors">
              Edit
            </button>
            <button className="flex-1 bg-red-50 text-red-700 border border-red-100 font-bold py-3 px-4 rounded-md hover:bg-red-100 transition-colors">
              Delete
            </button>
          </div>
        );
      }
      return (
        <button disabled className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-md cursor-not-allowed">
          Locked ({formatStatus(item.status)})
        </button>
      );
    }

    // 3. Receiver View (Request the item, or see pending status)
    if (role === 'receiver') {
      if (item.status === 'available') {
        return (
          <button onClick={handleReceiverRequest} className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 transition-colors">
            Request Donation
          </button>
        );
      }
      if (item.status === 'pending') {
        return (
          <button disabled className="w-full bg-orange-50 text-orange-700 border border-orange-200 font-bold py-3 px-4 rounded-md cursor-not-allowed">
            Request Pending Admin Approval
          </button>
        );
      }
      return (
        <button disabled className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-md cursor-not-allowed">
          Cannot Request ({formatStatus(item.status)})
        </button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="text-emerald-700 font-semibold text-sm hover:underline mb-6 inline-flex items-center gap-2"
        >
          ← Back to previous page
        </button>

        {loading && (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-500 shadow-sm font-semibold">
            Loading donation details...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 mb-6 shadow-sm font-semibold">
            {error}
          </div>
        )}

        {!loading && !error && item && (
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden flex flex-col md:flex-row">
            
            <div className="w-full md:w-1/2 h-72 md:h-auto bg-gray-100 border-r border-gray-100">
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
                <div className="w-full h-full flex items-center justify-center text-emerald-700 font-semibold bg-emerald-50 tracking-wide">
                  NO IMAGE PROVIDED
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {item.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${getStatusStyle(item.status)}`}>
                  {formatStatus(item.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                  {item.category}
                </span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                  {item.condition}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                  Qty: {item.quantity}
                </span>
              </div>

              <div className="flex-grow">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 mt-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.location?.suburb || 'N/A'}{item.location?.postcode ? `, ${item.location.postcode}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted On</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                {renderActionButtons()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}