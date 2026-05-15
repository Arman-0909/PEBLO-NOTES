import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pebloLogo from '../assets/peblo-notes.png';
import { LogOut, BookOpen, LayoutDashboard, Plus, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Keyboard shortcut for new note
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        navigate('/notes/new');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!token) return null;

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 pb-2 bg-purple-50/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-300">
      <nav className="container mx-auto max-w-5xl bg-white dark:bg-slate-800 shadow-md border-b-4 border-purple-100 dark:border-slate-700 rounded-3xl px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
        
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <img src={pebloLogo} alt="Peblo Notes" className="h-12 object-contain" />
        </Link>

        <div className="flex items-center space-x-1 bg-purple-50 dark:bg-slate-700 p-1.5 rounded-3xl border-b-2 border-purple-100 dark:border-slate-600 transition-colors duration-300">
          <NavLink to="/" icon={LayoutDashboard} active={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/notes" icon={BookOpen} active={location.pathname.startsWith('/notes') && location.pathname !== '/notes/new'}>Notes</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-slate-700 dark:text-amber-400 dark:hover:bg-slate-600 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
          </button>
          
          <Link 
            to="/notes/new" 
            title="Alt + N"
            className="btn-bubbly-primary py-2.5 px-5 flex items-center gap-2 text-sm"
          >
            <Plus size={18} strokeWidth={3} /> <span className="hidden sm:inline">New Note</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-purple-400 hover:text-red-500 font-black px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all"
          >
            <LogOut size={20} strokeWidth={3} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function NavLink({ to, children, icon: Icon, active }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black transition-all ${
        active 
          ? 'bg-white dark:bg-slate-600 text-purple-700 dark:text-purple-100 shadow-sm border-b-2 border-purple-200 dark:border-slate-500' 
          : 'text-purple-400 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-slate-600/50'
      }`}
    >
      {Icon && <Icon size={18} strokeWidth={3} />}
      {children}
    </Link>
  );
}
