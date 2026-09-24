import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State to toggle between the different admin use cases
  const [activeTab, setActiveTab] = useState('users');

  // Get the logged-in admin's information from the browser
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || 'Admin User';

  // Create the user's initials
  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Clear session data and redirect to homepage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); 
  };

  // Prevent non-admins from viewing this page (Security measure)
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>
          <span className="text-xl font-bold tracking-tight">
            Givespace
          </span>
        </div>
      
        {/* Central Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">Home</Link>
          <Link to="/how-it-works" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">How It Works</Link>
          <Link to="/about-us" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">About Us</Link>
          <Link to="/admin-dashboard" className="text-sm font-bold text-emerald-700">Dashboard</Link>
        </div>

        {/* User Profile Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-800">
            {initials}
          </div>
          <span className="text-sm font-semibold mr-2">
            {userName}
          </span>
          
          <button 
            onClick={handleLogout}
            className="border border-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-md hover:bg-gray-50 hover:text-emerald-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-2">
              IT Admin Portal
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              System Administration
            </h1>
            <p className="text-gray-500 text-sm">
              Manage users, platform UI, database settings, and system reports.
            </p>
          </div>

          {/* Action button changes based on active tab */}
          {activeTab === 'staff' && (
            <Link
              to="/admin/add-staff"
              className="bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm"
            >
              <span>+</span> Create Staff Account
            </Link>
          )}
          {activeTab === 'reports' && (
            <button
              className="bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm"
            >
              Export Analytics (CSV)
            </button>
          )}
        </div>

        {/* Display an error message if something fails */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* System Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1 text-emerald-700">Healthy</p>
            <p className="text-xs text-gray-500 font-medium">Database Status</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">24</p>
            <p className="text-xs text-gray-500 font-medium">Active Staff Accounts</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">1,204</p>
            <p className="text-xs text-gray-500 font-medium">Total Registered Users</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">8</p>
            <p className="text-xs text-gray-500 font-medium">Pending Support Tickets</p>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('users')}
            className={`text-sm font-bold pb-3 ${activeTab === 'users' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`text-sm font-bold pb-3 ${activeTab === 'staff' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Staff Accounts
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`text-sm font-bold pb-3 ${activeTab === 'content' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            UI / Content
          </button>
          <button 
            onClick={() => setActiveTab('database')}
            className={`text-sm font-bold pb-3 ${activeTab === 'database' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Database
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`text-sm font-bold pb-3 ${activeTab === 'reports' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            System Reports
          </button>
        </div>

        {/* Tab Content Areas */}
        <div className="w-full">
          
          {/* UC21: Manage User Accounts */}
          {activeTab === 'users' && (
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 text-center">
              <h2 className="text-lg font-bold mb-2">User Management</h2>
              <p className="text-gray-500 text-sm mb-4">Search, suspend, or delete standard user profiles (Donors and Receivers).</p>
              <input type="text" placeholder="Search by email or name..." className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-emerald-700 w-full max-w-md" />
            </div>
          )}

          {/* UC22: Manage Staff Accounts */}
          {activeTab === 'staff' && (
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 text-center">
              <h2 className="text-lg font-bold mb-2">Staff Access Control</h2>
              <p className="text-gray-500 text-sm">View and manage roles for Record Officers and Customer Service representatives.</p>
            </div>
          )}

          {/* UC23: Manage UI/UX Interface */}
          {activeTab === 'content' && (
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 text-center">
              <h2 className="text-lg font-bold mb-2">Content Management System</h2>
              <p className="text-gray-500 text-sm">Update platform announcements, homepage banners, and static text configurations.</p>
            </div>
          )}

          {/* UC24: Manage Database */}
          {activeTab === 'database' && (
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 text-center">
              <h2 className="text-lg font-bold mb-2">Database Maintenance</h2>
              <p className="text-gray-500 text-sm mb-4">Execute maintenance scripts and optimize MongoDB collections.</p>
              <button className="bg-red-50 text-red-700 border border-red-200 font-bold px-4 py-2 rounded-md hover:bg-red-100 text-sm">
                Clear Orphaned Records
              </button>
            </div>
          )}

          {/* UC25: Generate System Reports */}
          {activeTab === 'reports' && (
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 text-center">
              <h2 className="text-lg font-bold mb-2">Analytics & Exports</h2>
              <p className="text-gray-500 text-sm">Generate metrics on donation volumes, user growth, and request fulfillment rates.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}