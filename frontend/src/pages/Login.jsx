import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import pebloLogo from '../assets/peblo-notes.png';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <img src={pebloLogo} alt="Peblo Notes" className="h-24 mx-auto object-contain mb-4 hover:scale-105 transition-transform duration-300 drop-shadow-md" />
          <h1 className="heading-1">Welcome Back!</h1>
          <p className="text-purple-600 mt-2 font-bold text-lg">Ready for an adventure in learning?</p>
        </div>

        <div className="card-base">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-center text-sm font-bold border-2 border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-purple-800 mb-2 ml-2">Explorer Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-base"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="block text-lg font-bold text-purple-800 mb-2 ml-2">Secret Code</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-base"
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="w-full btn-bubbly-primary text-xl mt-4">
              Let's Go!
            </button>
          </form>
          
          <p className="mt-8 text-center text-purple-600 font-bold">
            New here?{' '}
            <Link to="/register" className="text-amber-500 hover:text-amber-600 hover:underline">
              Join the club!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
