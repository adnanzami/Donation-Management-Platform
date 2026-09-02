import React from 'react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      id: '01',
      title: 'Register your account',
      description: 'Sign up in seconds. Choose whether you want to donate items you no longer need, or request items you are looking for.',
      img: '/api/placeholder/600/400'
    },
    {
      id: '02',
      title: 'List or request items',
      description: 'Donors can quickly upload photos and details of available items. Receivers can browse the active inventory and submit requests for what they need.',
      img: '/api/placeholder/600/400'
    },
    {
      id: '03',
      title: 'Connect and exchange',
      description: 'Once a request is approved, Givespace connects the donor and receiver to arrange a secure, local handoff. No money, no waste, no middlemen.',
      img: '/api/placeholder/600/400'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-700 rounded-sm"></div>
          <span className="text-xl font-bold tracking-tight">Givespace</span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <Link to="/" className="hover:text-gray-900">Browse</Link>
          <Link to="/how-it-works" className="text-emerald-700 font-bold">How It Works</Link>
          <Link to="/about" className="hover:text-gray-900">About</Link>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="text-gray-900 hover:underline">Log in</Link>
          <Link to="/register" className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors">Register</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">Simple Process</p>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          How Givespace Works
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We've made it as easy as possible to give physical items a second life. Here is how you can start making an impact in your community today.
        </p>
      </header>

      {/* Steps Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-24">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="w-full h-72 md:h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <img 
                    src={step.img} 
                    alt={step.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-emerald-700 text-5xl font-extrabold opacity-20 mb-4 tracking-tighter">
                  {step.id}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mt-20">
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