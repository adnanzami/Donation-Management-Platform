import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-orange-50 text-orange-700 border border-orange-100';
    case 'approved': return 'bg-green-50 text-green-700 border border-green-100';
    case 'rejected': return 'bg-red-50 text-red-700 border border-red-100';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function ReceiverDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [availableItems, setAvailableItems] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // CRITICAL FIX: Parse the user from localStorage ONLY ONCE on initial load
  // to prevent an infinite re-render loop.
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Protect the route
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role?.toLowerCase() === 'donor') {
      navigate('/donor-dashboard');
    }
  }, [user, navigate]);

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      try {
        const token = localStorage.getItem('token');
        const endpoint = activeTab === 'available' 
          ? 'http://localhost:3010/api/donation-items/available'
          : 'http://localhost:3010/api/requests/mine'; 

        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error fetching data');

        if (activeTab === 'available') {
          setAvailableItems(data.donationItems || []);
        } else {
          setMyRequests(data.requests || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if user is logged in
    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-2">Receiver Portal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Item Requests</h1>
          <p className="text-gray-500 text-sm">Browse available donations and track your active requests.</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('available')}
            className={`text-sm font-bold pb-3 ${activeTab === 'available' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Available Donations
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`text-sm font-bold pb-3 ${activeTab === 'requests' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            My Requests
          </button>
        </div>

        <div className="w-full">
          {loading ? (
            <p className="py-6 text-gray-500">Loading data...</p>
          ) : activeTab === 'available' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableItems.length === 0 && <p className="text-gray-500">No items are currently available.</p>}
              {availableItems.map(item => (
                <div key={item._id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col">
                  
                  {/* --- Image Thumbnail --- */}
                  <div className="w-full h-40 bg-gray-100 rounded-md mb-4 overflow-hidden border border-gray-100">
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
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold bg-emerald-50">
                        N/A
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category} • {item.condition}</p>
                  
                  {/* --- Description Preview --- */}
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 flex-grow">{item.description}</p>
                  
                  <Link 
                    to={`/donation/${item._id}`} 
                    className="w-full bg-emerald-700 text-white text-center font-bold py-2 rounded-md hover:bg-emerald-800 mt-auto block"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {myRequests.length === 0 && <p className="py-6 text-gray-500">You have no active requests.</p>}
              {myRequests.map(req => (
                <div key={req._id} className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-50 px-2">
                  <div className="col-span-6 font-bold text-gray-900">{req.itemTitle}</div>
                  <div className="col-span-3 text-sm text-gray-600">Requested on: {new Date(req.createdAt).toLocaleDateString()}</div>
                  <div className="col-span-3 text-right">
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(req.status)}`}>
                      {req.status?.toUpperCase() || 'UNKNOWN'}
                    </span>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}