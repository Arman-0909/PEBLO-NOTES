import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pebloLogo from '../assets/peblo-notes.png';
import { LogOut, BookOpen, LayoutDashboard, Plus, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && e.key === 'n') { e.preventDefault(); navigate('/notes/new'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  if (!token) return null;

  const isNotes = location.pathname.startsWith('/notes') && location.pathname !== '/notes/new';

  return (
    <div className="nav-bar-wrapper">
      <nav className="nav-bar-inner">
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <img src={pebloLogo} alt="Peblo Notes" className="h-12 object-contain" />
        </Link>

        <div className="nav-links-container">
          <NavLink to="/" icon={LayoutDashboard} active={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/notes" icon={BookOpen} active={isNotes}>Notes</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsDark(!isDark)} className="btn-icon" title="Toggle Theme">
            {isDark ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
          </button>
          <Link to="/notes/new" title="Alt + N" className="btn-bubbly-primary py-2.5 px-5 flex items-center gap-2 text-sm">
            <Plus size={18} strokeWidth={3} /> <span className="hidden sm:inline">New Note</span>
          </Link>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="btn-danger-text">
            <LogOut size={20} strokeWidth={3} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function NavLink({ to, children, icon: Icon, active }) {
  return (
    <Link to={to} className={active ? 'nav-link-active' : 'nav-link'}>
      {Icon && <Icon size={18} strokeWidth={3} />}
      {children}
    </Link>
  );
}
