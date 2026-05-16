import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import pebloLogo from '../assets/peblo-notes.png';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function update(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={pebloLogo}
            alt="Peblo Notes"
            className="h-24 mx-auto object-contain mb-4 hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
          <h1 className="heading-1">Join Peblo!</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2 font-bold text-lg">
            Start your amazing learning journey
          </p>
        </div>

        <div className="card-base">
          {error && <div className="alert-error">{error}</div>}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl mb-6 text-center text-sm font-bold border-2 border-emerald-200 dark:border-emerald-900/50">
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="form-label">Pick a Name</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={update}
                required
                className="input-base"
                placeholder="e.g. SmartExplorer"
              />
            </div>
            <div>
              <label className="form-label">Make a Secret Code</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                required
                className="input-base"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading || success} className="w-full btn-bubbly-accent text-xl mt-4">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-purple-600 dark:text-purple-400 font-bold">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Log in here!</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
