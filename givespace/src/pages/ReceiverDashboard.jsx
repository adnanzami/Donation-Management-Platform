import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3010/api';

export default function ReceiverDashboard() {
  const navigate = useNavigate();

  const [availableItems, setAvailableItems] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeSection, setActiveSection] = useState('available');
  const [selectedItem, setSelectedItem] = useState(null);
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // Check that the user is logged in as a Receiver
  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    if (user.role === 'Admin') {
      navigate('/admin-dashboard');
      return;
    }

    if (user.role === 'Donor') {
      navigate('/donor-dashboard');
      return;
    }

    if (user.role !== 'Receiver') {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, []);

  // Extract arrays from different possible API response formats
  const extractArray = (data, properties) => {
    if (Array.isArray(data)) {
      return data;
    }

    for (const property of properties) {
      if (Array.isArray(data?.[property])) {
        return data[property];
      }
    }

    return [];
  };

  // Load available donations and the Receiver's requests
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [itemsResponse, requestsResponse] = await Promise.all([
        fetch(`${API_URL}/donation-items/available`),

        fetch(`${API_URL}/donation-requests/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const itemsData = await itemsResponse.json();
      const requestsData = await requestsResponse.json();

      if (!itemsResponse.ok) {
        throw new Error(
          itemsData.message || 'Could not load available donations.'
        );
      }

      if (!requestsResponse.ok) {
        throw new Error(
          requestsData.message || 'Could not load your requests.'
        );
      }

      setAvailableItems(
        extractArray(itemsData, [
          'donationItems',
          'items',
          'data',
        ])
      );

      setMyRequests(
        extractArray(requestsData, [
          'donationRequests',
          'requests',
          'data',
        ])
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open the donation request form
  const openRequestForm = (item) => {
    setSelectedItem(item);
    setJustification('');
    setMessage('');
    setError('');
  };

  // Close the donation request form
  const closeRequestForm = () => {
    setSelectedItem(null);
    setJustification('');
  };

  // Submit a new donation request
  const submitRequest = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');

    if (justification.trim().length < 10) {
      setError(
        'Please enter a reason containing at least 10 characters.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/donation-requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            donationItemId: selectedItem._id,
            justification: justification.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'The request could not be submitted.'
        );
      }

      setSelectedItem(null);
      setJustification('');
      setMessage(
        'Your donation request was submitted successfully.'
      );
      setActiveSection('requests');

      await loadDashboardData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel a pending request
  const cancelRequest = async (requestId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this request?'
    );

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      const response = await fetch(
        `${API_URL}/donation-requests/${requestId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'The request could not be cancelled.'
        );
      }

      setMessage('The donation request was cancelled.');
      await loadDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Log the user out
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getItemFromRequest = (request) => {
    return request.donationItemId || request.donationItem || {};
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      approved: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
      cancelled: 'bg-gray-100 text-gray-600',
      completed: 'bg-blue-50 text-blue-700',
    };

    return styles[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>

          <span className="text-xl font-bold tracking-tight">
            Givespace
          </span>
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <Link
            to="/"
            className="hover:text-gray-900"
          >
            Home
          </Link>

          <Link
            to="/how-it-works"
            className="hover:text-gray-900"
          >
            How It Works
          </Link>

          <Link
            to="/about"
            className="hover:text-gray-900"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-semibold">
            Welcome, {user?.name || 'Receiver'}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="border border-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-md hover:bg-gray-50 hover:text-emerald-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard heading */}
        <section className="mb-12">
          <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-3">
            Receiver Dashboard
          </p>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Find something
                <span className="text-emerald-700"> useful.</span>
              </h1>

              <p className="text-gray-500 mt-4 max-w-xl">
                Browse available donations and submit a request for
                the items you need.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl px-8 py-5 bg-white">
              <p className="text-3xl font-bold text-gray-900">
                {myRequests.length}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Total requests
              </p>
            </div>
          </div>
        </section>

        {/* Section buttons */}
        <div className="flex gap-3 border-b border-gray-100 mb-10">
          <button
            type="button"
            onClick={() => setActiveSection('available')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${
              activeSection === 'available'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Available Donations
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('requests')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${
              activeSection === 'requests'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            My Requests
          </button>
        </div>

        {message && (
          <div className="mb-8 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-100 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <p className="py-12 text-gray-500">
            Loading information...
          </p>
        )}

        {/* Available donations */}
        {!loading && activeSection === 'available' && (
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  Available donations
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select an item to submit a request.
                </p>
              </div>

              <span className="text-sm text-gray-400">
                {availableItems.length} items
              </span>
            </div>

            {availableItems.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-12 text-center">
                <h3 className="font-bold text-gray-900">
                  No donations are currently available
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Please check again later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableItems.map((item) => (
                  <article
                    key={item._id}
                    className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
                  >
                    {item.images?.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-52 object-cover bg-gray-100"
                      />
                    ) : (
                      <div className="w-full h-52 bg-emerald-50 flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold">
                          No image available
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {item.title}
                        </h3>

                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                          {item.category || 'Other'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-5 flex-grow">
                        {item.description ||
                          'No description provided.'}
                      </p>

                      <div className="text-sm text-gray-500 space-y-2 mb-6">
                        <p>
                          <span className="font-semibold text-gray-800">
                            Condition:
                          </span>{' '}
                          {item.condition || 'Not specified'}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-800">
                            Quantity:
                          </span>{' '}
                          {item.quantity || 1}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-800">
                            Location:
                          </span>{' '}
                          {item.location?.suburb ||
                            item.suburb ||
                            'Not specified'}

                          {item.location?.postcode
                            ? `, ${item.location.postcode}`
                            : ''}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openRequestForm(item)}
                        className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 transition-colors"
                      >
                        Request this item
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Receiver requests */}
        {!loading && activeSection === 'requests' && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                My donation requests
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Review the status of your submitted requests.
              </p>
            </div>

            {myRequests.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-12 text-center">
                <h3 className="font-bold text-gray-900">
                  You have not submitted any requests
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Browse the available donations to request an item.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => {
                  const item = getItemFromRequest(request);

                  return (
                    <article
                      key={request._id}
                      className="border border-gray-100 rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between gap-5">
                        <div>
                          <h3 className="text-lg font-bold">
                            {item.title || 'Donation item'}
                          </h3>

                          <p className="text-sm text-gray-600 mt-2">
                            {request.justification}
                          </p>

                          <p className="text-xs text-gray-400 mt-4">
                            Requested:{' '}
                            {request.createdAt
                              ? new Date(
                                  request.createdAt
                                ).toLocaleDateString()
                              : 'Date unavailable'}
                          </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-4">
                          <span
                            className={`text-xs font-bold capitalize px-3 py-1.5 rounded-full ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>

                          {request.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() =>
                                cancelRequest(request._id)
                              }
                              className="text-sm font-bold text-red-600 hover:text-red-700"
                            >
                              Cancel request
                            </button>
                          )}
                        </div>
                      </div>

                      {request.reviewNote && (
                        <div className="mt-5 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                          <span className="font-bold text-gray-900">
                            Admin note:
                          </span>{' '}
                          {request.reviewNote}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Request form modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-7 shadow-xl">
            <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-2">
              Donation Request
            </p>

            <h2 className="text-2xl font-bold text-gray-900">
              Request {selectedItem.title}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Explain briefly why you need this donation.
            </p>

            <form onSubmit={submitRequest} className="mt-6">
              <label
                htmlFor="justification"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                Reason for request
              </label>

              <textarea
                id="justification"
                value={justification}
                onChange={(event) =>
                  setJustification(event.target.value)
                }
                placeholder="Please provide a short explanation..."
                rows="6"
                maxLength="500"
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none resize-y"
              />

              <p className="text-xs text-gray-400 text-right mt-1">
                {justification.length}/500 characters
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeRequestForm}
                  disabled={submitting}
                  className="border border-gray-300 text-gray-700 font-bold px-5 py-2.5 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-md hover:bg-emerald-800 transition-colors disabled:opacity-60"
                >
                  {submitting
                    ? 'Submitting...'
                    : 'Submit request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}