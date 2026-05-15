import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import pebloLogo from '../assets/peblo-notes.png';
import { LogOut, BookOpen, LayoutDashboard, Plus } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

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
    <div className="sticky top-0 z-50 px-4 pt-4 pb-2 bg-purple-50/90 backdrop-blur-md">
      <nav className="container mx-auto max-w-5xl bg-white shadow-md border-b-4 border-purple-100 rounded-3xl px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <img src={pebloLogo} alt="Peblo Notes" className="h-12 object-contain" />
        </Link>

        <div className="flex items-center space-x-1 bg-purple-50 p-1.5 rounded-3xl border-b-2 border-purple-100">
          <NavLink to="/" icon={LayoutDashboard} active={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/notes" icon={BookOpen} active={location.pathname.startsWith('/notes') && location.pathname !== '/notes/new'}>Notes</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/notes/new" 
            title="Alt + N"
            className="btn-bubbly-primary py-2.5 px-5 flex items-center gap-2 text-sm"
          >
            <Plus size={18} strokeWidth={3} /> New Note
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-purple-400 hover:text-red-500 font-black px-4 py-2 hover:bg-red-50 rounded-2xl transition-all"
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
          ? 'bg-white text-purple-700 shadow-sm border-b-2 border-purple-200' 
          : 'text-purple-400 hover:text-purple-600 hover:bg-purple-100/50'
      }`}
    >
      {Icon && <Icon size={18} strokeWidth={3} />}
      {children}
    </Link>
  );
}
