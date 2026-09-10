// Import React and the tools needed to manage data
import React, { useEffect, useState } from 'react';

// Import Link to navigate between React pages
import { Link } from 'react-router-dom';

export default function Homepage() {
  // Store the available donations received from the backend
  const [items, setItems] = useState([]);

  // Store the selected category
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Store whether the information is loading
  const [loading, setLoading] = useState(true);

  // Store an error message if something goes wrong
  const [error, setError] = useState('');

  // Check whether the user has logged in
  const token = localStorage.getItem('token');

  // Send logged-in users to the donation form
  // Send visitors to the login page
  const donationPath = token ? '/create-donation' : '/login';

  // Load all available donations when the homepage opens
  useEffect(() => {
    const loadAvailableItems = async () => {
      try {
        // Request the available donations from the backend
        const response = await fetch(
          'http://localhost:3010/api/donation-items/available'
        );

        // Convert the server response into a JavaScript object
        const data = await response.json();

        // Stop the process if the server returns an error
        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load available items'
          );
        }

        // Save the available donations so React can display them
        setItems(data.donationItems);
      } catch (error) {
        // Display an error message on the homepage
        setError(error.message);
      } finally {
        // Stop displaying the loading message
        setLoading(false);
      }
    };

    loadAvailableItems();
  }, []);

  // Create the category buttons using the real donation data
  const categories = [
    'All',
    ...new Set(items.map((item) => item.category))
  ];

  // Display all items or only items from the selected category
  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter(
          (item) => item.category === selectedCategory
        );

  // Count the different categories
  const totalCategories = new Set(
    items.map((item) => item.category)
  ).size;

  // Count the different suburbs
  const totalAreas = new Set(
    items
      .map((item) => item.location?.suburb)
      .filter(Boolean)
  ).size;

  // Move the page to the available items section
  const scrollToItems = () => {
    document
      .getElementById('available-items')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>

          <span className="text-xl font-bold tracking-tight">
            Givespace
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <Link
            to="/"
            className="text-emerald-700 font-bold"
          >
            Browse
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

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/login"
            className="text-gray-900 hover:underline"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">
            Free. Community-driven. Real.
          </p>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
            Give what you <br />
            don't need. <br />

            <span className="text-emerald-700">
              Help someone
            </span>

            <br />
            who does.
          </h1>

          <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed">
            Givespace connects people donating physical items
            with neighbors who need them — no money, no waste,
            no middlemen.
          </p>

          <div className="flex gap-4">
            {/* Open the donation form or login page */}
            <Link
              to={donationPath}
              className="bg-emerald-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-emerald-800 transition-colors"
            >
              Donate an item
            </Link>

            {/* Move to the available items section */}
            <button
              type="button"
              onClick={scrollToItems}
              className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              Browse items
            </button>
          </div>
        </div>

        {/* Statistics calculated from real available donations */}
        <div className="flex gap-12 border-b border-gray-100 pb-12 mt-20">
          <div>
            <p className="text-3xl font-bold">
              {items.length}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Items available
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold">
              {totalCategories}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Categories
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold">
              {totalAreas}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Areas active
            </p>
          </div>
        </div>

        {/* Available items section */}
        <div id="available-items" className="mt-16">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available now
            </h2>

            <p className="text-sm text-gray-400">
              Showing {filteredItems.length} of {items.length} items
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                  selectedCategory === category
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Display a message while loading */}
          {loading && (
            <p className="py-10 text-gray-500">
              Loading available items...
            </p>
          )}

          {/* Display an error message if loading fails */}
          {error && (
            <div className="mb-8 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Display a message when there are no available items */}
          {!loading && !error && filteredItems.length === 0 && (
            <p className="py-10 text-gray-500">
              There are no available items in this category.
            </p>
          )}

          {/* Item grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
              >
                {/* Display the first image or a placeholder */}
                {item.images?.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-56 object-cover bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-56 bg-emerald-50 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold">
                      No image available
                    </span>
                  </div>
                )}

                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                      {item.condition}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    {item.category}

                    <span className="mx-1">•</span>

                    {item.location?.suburb || 'Location unavailable'}

                    {item.location?.postcode
                      ? `, ${item.location.postcode}`
                      : ''}
                  </p>

                  <p className="text-sm text-gray-600 mb-6 flex-grow">
                    {item.description}
                  </p>

                  {/* This button will be connected later */}
                  <button
                    type="button"
                    className="w-full border border-gray-200 text-emerald-700 font-semibold py-2 rounded-md hover:bg-emerald-50 transition-colors"
                  >
                    Request item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-lg font-bold tracking-tight">
          Givespace
        </span>

        <span className="text-xs text-gray-400">
          © 2026 Givespace. Built for communities.
        </span>

        <div className="flex gap-6 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600">
            Privacy
          </a>

          <a href="#" className="hover:text-gray-600">
            Terms
          </a>

          <a href="#" className="hover:text-gray-600">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}