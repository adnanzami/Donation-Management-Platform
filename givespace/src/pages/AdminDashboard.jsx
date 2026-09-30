import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

// Convert a MongoDB date into a readable Australian date
const formatDate = (date) => {
  if (!date) return 'No date';

  return new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Store pending donation items and donation requests
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  // Control which section is visible
  const [activeSection, setActiveSection] = useState('donations');

  // Store review notes
  const [donationNotes, setDonationNotes] = useState({});
  const [requestNotes, setRequestNotes] = useState({});

  // Store page status
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const userRole = user?.role;
  const userName = user?.name || 'Admin User';

  // Create the administrator's initials
  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Extract an array from different API response formats
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

  // Load pending donation items and pending donation requests
  const loadPendingData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const currentToken = localStorage.getItem('token');

      const [donationsResponse, requestsResponse] =
        await Promise.all([
          fetch(
            'http://localhost:3010/api/donation-items/pending',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${currentToken}`,
              },
            }
          ),

          fetch(
            'http://localhost:3010/api/donation-requests/pending',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${currentToken}`,
              },
            }
          ),
        ]);

      const donationsData = await donationsResponse.json();
      const requestsData = await requestsResponse.json();

      if (!donationsResponse.ok) {
        throw new Error(
          donationsData.message ||
            'Unable to load pending donations.'
        );
      }

      if (!requestsResponse.ok) {
        throw new Error(
          requestsData.message ||
            'Unable to load pending donation requests.'
        );
      }

      setDonations(
        extractArray(donationsData, [
          'donationItems',
          'items',
          'data',
        ])
      );

      setRequests(
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
  }, []);

  // Protect the dashboard and load its information
  useEffect(() => {
    if (!token || userRole !== 'Admin') {
      navigate('/login');
      return;
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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center border-b border-gray-100">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>

          <span className="text-xl font-bold tracking-tight">
            Givespace
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-600 hover:text-emerald-700"
          >
            Home
          </Link>

          <Link
            to="/how-it-works"
            className="text-sm font-semibold text-gray-600 hover:text-emerald-700"
          >
            How It Works
          </Link>

          <Link
            to="/about"
            className="text-sm font-semibold text-gray-600 hover:text-emerald-700"
          >
            About
          </Link>

          <span className="text-sm font-bold text-emerald-700">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-emerald-100 items-center justify-center text-xs font-bold text-emerald-800">
            {initials}
          </div>

          <span className="hidden sm:block text-sm font-semibold">
            {userName}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="border border-gray-300 text-sm font-bold px-4 py-2 rounded-md hover:text-emerald-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page heading */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
          <div>
            <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-2">
              Admin Portal
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Review Centre
            </h1>

            <p className="text-gray-500 text-sm">
              Review donation items and Receiver requests.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPendingData}
            disabled={loading}
            className="border border-emerald-700 text-emerald-700 font-bold px-5 py-2.5 rounded-md hover:bg-emerald-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold text-amber-600 mb-1">
              {donations.length}
            </p>

            <p className="text-xs text-gray-500 font-medium">
              Pending Donation Items
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold text-emerald-700 mb-1">
              {requests.length}
            </p>

            <p className="text-xs text-gray-500 font-medium">
              Pending Donation Requests
            </p>
          </div>
        </div>

        {/* Dashboard sections */}
        <div className="flex gap-4 border-b border-gray-100 mb-8">
          <button
            type="button"
            onClick={() => {
              setActiveSection('donations');
              setError('');
              setSuccess('');
            }}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${
              activeSection === 'donations'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Donation Items ({donations.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSection('requests');
              setError('');
              setSuccess('');
            }}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${
              activeSection === 'requests'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Donation Requests ({requests.length})
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
            {success}
          </div>
        )}

        {loading && (
          <p className="py-10 text-gray-500">
            Loading pending information...
          </p>
        )}

        {/* Pending donation items */}
        {!loading && activeSection === 'donations' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Pending Donation Items
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Approve items before they appear publicly.
              </p>
            </div>

            {donations.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-10 text-center">
                <h3 className="font-bold text-lg mb-2">
                  No donations awaiting review
                </h3>

                <p className="text-sm text-gray-500">
                  New Donor submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {donations.map((item) => (
                  <article
                    key={item._id}
                    className="border border-gray-200 rounded-xl p-6 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Donation information */}
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-bold">
                              {item.title}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Submitted by{' '}
                              {item.donorId?.name ||
                                'Unknown donor'}
                              {' · '}
                              {formatDate(item.createdAt)}
                            </p>
                          </div>

                          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                            Pending
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">
                          {item.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                          <p>
                            <span className="font-bold">
                              Category:
                            </span>{' '}
                            {item.category}
                          </p>

                          <p>
                            <span className="font-bold">
                              Condition:
                            </span>{' '}
                            {item.condition}
                          </p>

                          <p>
                            <span className="font-bold">
                              Quantity:
                            </span>{' '}
                            {item.quantity}
                          </p>

                          <p>
                            <span className="font-bold">
                              Location:
                            </span>{' '}
                            {item.location?.suburb ||
                              'Not specified'}

                            {item.location?.postcode
                              ? `, ${item.location.postcode}`
                              : ''}
                          </p>
                        </div>
                      </div>

                      {/* Donation review controls */}
                      <div>
                        <label
                          htmlFor={`donation-note-${item._id}`}
                          className="block text-sm font-bold mb-2"
                        >
                          Review Note (Optional)
                        </label>

                        <textarea
                          id={`donation-note-${item._id}`}
                          rows="4"
                          value={
                            donationNotes[item._id] || ''
                          }
                          onChange={(event) =>
                            setDonationNotes(
                              (currentNotes) => ({
                                ...currentNotes,
                                [item._id]:
                                  event.target.value,
                              })
                            )
                          }
                          placeholder="Explain the decision if needed..."
                          className="w-full border border-gray-300 rounded-md p-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-emerald-700"
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              reviewDonation(
                                item._id,
                                'available'
                              )
                            }
                            disabled={
                              reviewingId ===
                              `donation-${item._id}`
                            }
                            className="flex-1 bg-emerald-700 text-white font-bold py-2 rounded-md hover:bg-emerald-800 disabled:opacity-50"
                          >
                            {reviewingId ===
                            `donation-${item._id}`
                              ? 'Saving...'
                              : 'Approve'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              reviewDonation(
                                item._id,
                                'rejected'
                              )
                            }
                            disabled={
                              reviewingId ===
                              `donation-${item._id}`
                            }
                            className="flex-1 bg-red-50 text-red-700 border border-red-200 font-bold py-2 rounded-md hover:bg-red-100 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Pending Receiver requests */}
        {!loading && activeSection === 'requests' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Pending Donation Requests
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Review requests submitted by Receivers.
              </p>
            </div>

            {requests.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-10 text-center">
                <h3 className="font-bold text-lg mb-2">
                  No requests awaiting review
                </h3>

                <p className="text-sm text-gray-500">
                  New Receiver requests will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {requests.map((request) => {
                  const item =
                    request.donationItemId ||
                    request.donationItem ||
                    {};

                  const receiver =
                    request.receiverId ||
                    request.receiver ||
                    {};

                  return (
                    <article
                      key={request._id}
                      className="border border-gray-200 rounded-xl p-6 shadow-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Request information */}
                        <div className="md:col-span-2">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-bold">
                                {item.title ||
                                  'Donation item'}
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Requested by{' '}
                                {receiver.name ||
                                  'Unknown Receiver'}
                                {receiver.email
                                  ? ` (${receiver.email})`
                                  : ''}
                                {' · '}
                                {formatDate(
                                  request.createdAt
                                )}
                              </p>
                            </div>

                            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                              Pending
                            </span>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-bold text-gray-900 mb-1">
                              Receiver&apos;s reason:
                            </p>

                            <p className="text-gray-700">
                              {request.justification}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                            <p>
                              <span className="font-bold">
                                Category:
                              </span>{' '}
                              {item.category ||
                                'Not specified'}
                            </p>

                            <p>
                              <span className="font-bold">
                                Condition:
                              </span>{' '}
                              {item.condition ||
                                'Not specified'}
                            </p>

                            <p>
                              <span className="font-bold">
                                Quantity:
                              </span>{' '}
                              {item.quantity || 1}
                            </p>

                            <p>
                              <span className="font-bold">
                                Location:
                              </span>{' '}
                              {item.location?.suburb ||
                                'Not specified'}

                              {item.location?.postcode
                                ? `, ${item.location.postcode}`
                                : ''}
                            </p>
                          </div>
                        </div>

                        {/* Request review controls */}
                        <div>
                          <label
                            htmlFor={`request-note-${request._id}`}
                            className="block text-sm font-bold mb-2"
                          >
                            Review Note (Optional)
                          </label>

                          <textarea
                            id={`request-note-${request._id}`}
                            rows="4"
                            value={
                              requestNotes[request._id] ||
                              ''
                            }
                            onChange={(event) =>
                              setRequestNotes(
                                (currentNotes) => ({
                                  ...currentNotes,
                                  [request._id]:
                                    event.target.value,
                                })
                              )
                            }
                            placeholder="Explain the decision if needed..."
                            className="w-full border border-gray-300 rounded-md p-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-emerald-700"
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                reviewRequest(
                                  request._id,
                                  'approved'
                                )
                              }
                              disabled={
                                reviewingId ===
                                `request-${request._id}`
                              }
                              className="flex-1 bg-emerald-700 text-white font-bold py-2 rounded-md hover:bg-emerald-800 disabled:opacity-50"
                            >
                              {reviewingId ===
                              `request-${request._id}`
                                ? 'Saving...'
                                : 'Approve'}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                reviewRequest(
                                  request._id,
                                  'rejected'
                                )
                              }
                              disabled={
                                reviewingId ===
                                `request-${request._id}`
                              }
                              className="flex-1 bg-red-50 text-red-700 border border-red-200 font-bold py-2 rounded-md hover:bg-red-100 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}