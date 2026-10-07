import React from 'react';
import { Link } from 'react-router-dom';

// 1. Import the hero image from your assets folder
import heroImg from '../assets/about.jpg';

// Navbar login
import Navbar from '../components/Navbar'; 

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Reusable Navigation Component */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Hero Image */}
        <div className="w-full h-64 md:h-[500px] bg-gray-100 rounded-2xl overflow-hidden mb-12 shadow-sm border border-gray-100">
          <img 
            src={heroImg} 
            alt="People sharing community items" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* About Text */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">Our Mission</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            About Us
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8">
            Givespace was built on a simple premise: everyone has things they no longer need, and someone nearby can use them. We are a community-driven platform dedicated to facilitating non-monetary physical item donations. By connecting donors directly with receivers, we aim to reduce environmental waste, eliminate middlemen, and foster stronger, more supportive local neighborhoods.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mt-12">
        <span className="text-lg font-bold tracking-tight">Givespace</span>
        <span className="text-xs text-gray-400">© 2026 Givespace. Built for communities.</span>
        <div className="flex gap-6 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-600">Privacy</Link>
          <Link to="/" className="hover:text-gray-600">Terms</Link>
          <Link to="/" className="hover:text-gray-600">Contact</Link>
        </div>
      </footer>
    </div>
  );
}