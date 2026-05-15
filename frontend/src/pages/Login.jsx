import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import pebloLogo from '../assets/peblo-notes.png';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const update = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={pebloLogo} alt="Peblo Notes" className="h-24 mx-auto object-contain mb-4 hover:scale-105 transition-transform duration-300 drop-shadow-md" />
          <h1 className="heading-1">Welcome Back!</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2 font-bold text-lg">Ready for an adventure in learning?</p>
        </div>

        <div className="card-base">
          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="form-label">Explorer Name</label>
              <input type="text" name="username" value={form.username} onChange={update} required className="input-base" placeholder="Enter your username" />
            </div>
            <div>
              <label className="form-label">Secret Code</label>
              <input type="password" name="password" value={form.password} onChange={update} required className="input-base" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full btn-bubbly-primary text-xl mt-4">Let's Go!</button>
          </form>

          <p className="mt-8 text-center text-purple-600 dark:text-purple-400 font-bold">
            New here? <Link to="/register" className="auth-link">Join the club!</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
