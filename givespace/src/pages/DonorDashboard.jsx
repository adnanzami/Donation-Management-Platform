import React from 'react';
import { Link } from 'react-router-dom';

const donations = [
  { id: 'DON-0091', title: 'IKEA Kallax Shelf Unit', category: 'Furniture', date: 'Aug 14, 2026', status: 'Available' },
  { id: 'DON-0087', title: 'Sony WH-1000XM4 Headphones', category: 'Electronics', date: 'Aug 9, 2026', status: 'Allocated' },
  { id: 'DON-0082', title: "Men's Winter Jacket — L", category: 'Clothing', date: 'Jul 30, 2026', status: 'Completed' },
  { id: 'DON-0078', title: 'Set of 6 Dining Chairs', category: 'Furniture', date: 'Jul 22, 2026', status: 'Pending' },
  { id: 'DON-0071', title: 'Canon EOS Rebel DSLR', category: 'Electronics', date: 'Jul 11, 2026', status: 'Completed' }
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'Available': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'Allocated': return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'Pending': return 'bg-orange-50 text-orange-700 border border-orange-100';
    case 'Completed': return 'bg-gray-100 text-gray-700 border border-gray-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function DonorDashboard() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>
          <span className="text-xl font-bold tracking-tight">Givespace</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
            ML
          </div>
          <span className="text-sm font-semibold">Marcus Lee</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-2">Donor Portal</p>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Your donations</h1>
            <p className="text-gray-500 text-sm">Track and manage everything you've given.</p>
          </div>
          <button className="bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm">
            <span>+</span> Submit New Donation
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">5</p>
            <p className="text-xs text-gray-500 font-medium">Total Donated</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">2</p>
            <p className="text-xs text-gray-500 font-medium">Items Allocated</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">2</p>
            <p className="text-xs text-gray-500 font-medium">Completed</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold mb-1">17</p>
            <p className="text-xs text-gray-500 font-medium">Total Requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-3">All</button>
          <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 pb-3">Active</button>
          <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 pb-3">Completed</button>
        </div>

        {/* Table */}
        <div className="w-full">
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            <div className="col-span-5">Item</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>

          <div className="flex flex-col">
            {donations.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-50 px-2 hover:bg-gray-50 transition-colors">
                <div className="col-span-5">
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.id}</p>
                </div>
                <div className="col-span-2 text-sm text-gray-600">{item.category}</div>
                <div className="col-span-2 text-sm text-gray-600">{item.date}</div>
                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <button className="text-emerald-700 font-bold text-sm hover:underline">
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}