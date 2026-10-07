import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  // Check if a user is currently logged in
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Determine the correct dashboard path based on the user's role
  const getDashboardPath = () => {
    if (!user) return '/login';
    
    // Normalize role string to handle capitalization safely
    const role = user.role?.toLowerCase();
    
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'donor') return '/donor-dashboard';
    if (role === 'receiver') return '/receiver-dashboard';
    
    return '/'; 
  };

  // Clear session data and redirect to homepage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // If they are already on the homepage, force a reload to update the UI
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center border-b border-gray-50">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>
        <span className="text-xl font-bold tracking-tight">
          Givespace
        </span>
      </div>

      {/* Central Navigation Links */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
        <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
        <Link to="/how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</Link>
        <Link to="/about" className="hover:text-emerald-700 transition-colors">About</Link>
      </div>

      {/* Conditional rendering for the top right corner */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-900">
            Welcome, {user.name}
          </span>
          
          <button 
            onClick={handleLogout}
            className="border border-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-md hover:bg-gray-50 hover:text-emerald-700 transition-colors"
          >
            Logout
          </button>

          <Link to={getDashboardPath()} className="bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors">
              Dashboard
            </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-emerald-700">Login</Link>
          <Link to="/register" className="bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}