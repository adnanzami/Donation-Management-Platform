import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for the item grid to keep the component clean
const items = [
  { id: 1, title: 'Vintage Oak Dining Table', condition: 'Good', category: 'Furniture', location: 'Brooklyn, NY', img: '/api/placeholder/400/250' },
  { id: 2, title: 'Road Bicycle — 21 Speed', condition: 'Excellent', category: 'Sports', location: 'Austin, TX', img: '/api/placeholder/400/250' },
  { id: 3, title: "Children's Book Collection", condition: 'Like New', category: 'Books', location: 'Seattle, WA', img: '/api/placeholder/400/250' },
  { id: 4, title: 'Standing Desk — Adjustable', condition: 'Good', category: 'Furniture', location: 'Chicago, IL', img: '/api/placeholder/400/250' },
  { id: 5, title: "Winter Coat — Women's M", condition: 'Good', category: 'Clothing', location: 'Denver, CO', img: '/api/placeholder/400/250' },
  { id: 6, title: 'Acoustic Guitar with Case', condition: 'Fair', category: 'Music', location: 'Nashville, TN', img: '/api/placeholder/400/250' }
];

const categories = ['All', 'Furniture', 'Sports', 'Books', 'Clothing', 'Music', 'Electronics'];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>
          <span className="text-xl font-bold tracking-tight">Givespace</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <Link to="/" className="text-emerald-700 font-bold">Home</Link>
          <Link to="/how-it-works" className="hover:text-gray-900">How It Works</Link>
          <Link to="/about" className="hover:text-gray-900">About</Link>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
        <Link to="/login" className="text-gray-900 hover:underline">
            Log in
        </Link>
        <Link to="/Register" className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors">
            Register
        </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">Free. Community-driven. Real.</p>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
            Give what you <br /> don't need. <br />
            <span className="text-emerald-700">Help someone</span> <br /> who does.
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed">
            Givespace connects people donating physical items with neighbors who need them — no money, no waste, no middlemen.
          </p>
          <div className="flex gap-4">
            <button className="bg-emerald-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-emerald-800 transition-colors">
              Donate an item 
            </button>
            <button className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
              Browse items
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-12 border-b border-gray-100 pb-12 mt-20">
          <div>
            <p className="text-3xl font-bold">4,812</p>
            <p className="text-sm text-gray-500 mt-1">Items donated</p>
          </div>
          <div>
            <p className="text-3xl font-bold">2,390</p>
            <p className="text-sm text-gray-500 mt-1">People helped</p>
          </div>
          <div>
            <p className="text-3xl font-bold">38</p>
            <p className="text-sm text-gray-500 mt-1">Cities active</p>
          </div>
        </div>

        {/* Browse Section */}
        <div className="mt-16">
          <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available now</h2>
            <p className="text-sm text-gray-400">Showing 6 of 214 items</p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat, idx) => (
              <button 
                key={cat} 
                className={`px-4 py-1.5 rounded-full text-sm font-medium border ${idx === 0 ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Item Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                <img src={item.img} alt={item.title} className="w-full h-56 object-cover bg-gray-100" />
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                      {item.condition}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 flex-grow">{item.category} <span className="mx-1">•</span> {item.location}</p>
                  <button className="w-full border border-gray-200 text-emerald-700 font-semibold py-2 rounded-md hover:bg-emerald-50 transition-colors">
                    Request item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12 mb-20">
            <button className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-md hover:bg-gray-50 transition-colors">
              Load more items
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-lg font-bold tracking-tight">Givespace</span>
        <span className="text-xs text-gray-400">© 2026 Givespace. Built for communities.</span>
        <div className="flex gap-6 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600">Privacy</a>
          <a href="#" className="hover:text-gray-600">Terms</a>
          <a href="#" className="hover:text-gray-600">Contact</a>
        </div>
      </footer>
    </div>
  );
}