import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

    try {
      const response = await fetch(
        'http://localhost:3010/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      // Store the authentication information
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Use navigate() instead of window.location.href
      if (data.user.role.toLowerCase() === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.user.role.toLowerCase() === 'donor') {
        navigate('/donor-dashboard');
      } else {
        navigate('/receiver-dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-8 h-8 bg-emerald-700 rounded-sm mx-auto mb-4"></div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Log in to manage your non-monetary donations
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={formData.email}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition-colors"
              onChange={(event) =>
                setFormData({
                  ...formData,
                  email: event.target.value,
                })
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={formData.password}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition-colors"
              onChange={(event) =>
                setFormData({
                  ...formData,
                  password: event.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-emerald-700 font-bold hover:underline">Register Now</Link>
        </p>
        <p>
        <Link 
          to="/" 
          className="block text-center py-4 px-4 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline mb-6 transition-colors"
        >
          ← Back to Home
        </Link>
        </p>

        <Link
          to="/"
          className="block text-center py-4 px-4 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline mb-6 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}