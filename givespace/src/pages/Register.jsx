import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Donor' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      navigate('/login'); // Instantly route to login after successful creation
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
          <div className="w-8 h-8 bg-emerald-700 rounded-sm mx-auto mb-4"></div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
          <p className="text-sm text-gray-500 mt-2">Join Givespace to start making an impact</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition-colors"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition-colors"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition-colors"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">I want to...</label>
            <select 
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition-colors bg-white"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              value={formData.role}
            >
              <option value="Donor">Donate items</option>
              <option value="Receiver">Request items</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-800 transition-colors mt-2"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-emerald-700 font-bold hover:underline">Log in</Link>
        </p>
        <p>
        <Link 
  to="/" 
  className="block text-center py-4 px-4 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline mb-6 transition-colors"
>
  ← Back to Home
</Link>
        </p>
      </div>
    </div>
  );
}