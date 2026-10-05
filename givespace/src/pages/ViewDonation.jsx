import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Adjust this path based on your folder structure

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

export default function ViewDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the specific donation data when the component mounts
  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Ensure this backend route exists: router.get('/api/donation-items/:id')
        const response = await fetch(`http://localhost:3010/api/donation-items/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load donation details');
        }

        // Save the single item to state (adjust depending on how your backend wraps the response)
        setItem(data.donationItem || data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Centralized Navigation */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigate(-1) works just like the browser back button */}
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

        {/* Detailed Item Card */}
        {!loading && !error && item && (
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 h-72 md:h-auto bg-gray-100 border-r border-gray-100">
              {item.images && item.images.length > 0 ? (
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-700 font-semibold bg-emerald-50 tracking-wide">
                  NO IMAGE PROVIDED
                </div>
              )}
            </div>

            {/* Right Side: Specifications */}
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

              {/* Editing controls are locked unless the item is still pending or available */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                {item.status === 'available' || item.status === 'pending' ? (
                  <>
                    <button className="flex-1 bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-red-50 text-red-700 border border-red-100 font-bold py-3 px-4 rounded-md hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-md cursor-not-allowed">
                    Modifications locked ({item.status})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}