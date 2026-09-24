// Import React tools for managing the form
import React, { useState } from 'react';

// Import navigation so the user can return to the dashboard
import { useNavigate } from 'react-router-dom';

export default function CreateDonation() {
  // Create a navigation function
  const navigate = useNavigate();

  // Store all the information entered in the form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    quantity: 1,
    suburb: '',
    postcode: '',
    imageUrl: '' 
  });

  // Store an error message if the donation cannot be created
  const [error, setError] = useState('');

  // Store whether the donation is being submitted
  const [loading, setLoading] = useState(false);

  // Update the correct field whenever the user types
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Send the donation information to the backend
  const handleSubmit = async (event) => {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      // Get the authentication token saved during login
      const token = localStorage.getItem('token');

      // Send the donation to the backend
      const response = await fetch(
        'http://localhost:3010/api/donation-items',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            condition: formData.condition,
            quantity: Number(formData.quantity),
            images: formData.imageUrl ? [formData.imageUrl] : [], 
            location: {
              suburb: formData.suburb,
              postcode: formData.postcode
            }
          })
        }
      );

      // Convert the server response into a JavaScript object
      const data = await response.json();

      // Stop the process if the server returns an error
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create donation');
      }

      // Return to the dashboard after creating the donation
      navigate('/donor-dashboard');
    } catch (error) {
      // Display the error message on the form
      setError(error.message);
    } finally {
      // Allow the button to be used again
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Page navigation */}
      <nav className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>

          <span className="text-xl font-bold">
            Givespace
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/donor-dashboard')}
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          Back to dashboard
        </button>
      </nav>

      {/* Donation form */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
          <h1 className="text-3xl font-extrabold mb-2">
            Submit New Donation
          </h1>

          <p className="text-gray-500 text-sm mb-8">
            Enter the information about the item you want to donate.
          </p>

          {/* Display an error message if submission fails */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation title */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Item Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Donation description */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Donation Image URL */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Image URL (Optional)
              </label>

              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Donation category */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="">Select a category</option>
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Household">Household</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Donation condition */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Condition
              </label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="">Select the condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Donation quantity */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Donation location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Suburb
                </label>

                <input
                  type="text"
                  name="suburb"
                  value={formData.suburb}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Postcode
                </label>

                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Submit the form */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Donation'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}