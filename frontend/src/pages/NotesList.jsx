import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, Plus, Filter, FileText } from 'lucide-react';

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (tagFilter) params.append('tag', tagFilter);
      params.append('is_archived', showArchived);
      
      const response = await api.get(`/notes/?${params.toString()}`);
      setNotes(response.data.notes);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, tagFilter, showArchived]);

  const handleArchiveToggle = async (note, e) => {
    e.preventDefault();
    try {
      if (showArchived) {
        await api.patch(`/notes/${note.id}/unarchive`);
      } else {
        await api.patch(`/notes/${note.id}/archive`);
      }
      setNotes(notes.filter(n => n.id !== note.id));
    } catch (err) {
      alert(`Failed to ${showArchived ? 'unarchive' : 'archive'} note`);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="heading-1">My Workspace</h1>
          <p className="text-purple-500 font-bold mt-2 text-lg">Organize all your awesome ideas!</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-purple-600 bg-purple-50 hover:bg-purple-100 font-bold px-5 py-3 rounded-2xl transition-colors border-b-4 border-purple-200 active:translate-y-1 active:border-b-0"
          >
            {showArchived ? 'View Active' : 'View Archived'}
          </button>
          <Link 
            to="/notes/new" 
            className="btn-bubbly-primary flex items-center justify-center gap-2"
          >
            <Plus size={24} strokeWidth={3} /> <span className="text-xl">New Note</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-[2rem] shadow-md border-b-8 border-purple-200">
        <div className="flex-1 relative flex items-center bg-purple-50 rounded-2xl border-2 border-purple-100">
          <Search className="absolute left-5 text-purple-400" size={24} strokeWidth={3} />
          <input
            type="text"
            placeholder="Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-purple-900 font-bold placeholder-purple-300 text-lg"
          />
        </div>
        <div className="sm:w-80 relative flex items-center bg-purple-50 rounded-2xl border-2 border-purple-100">
          <Filter className="absolute left-5 text-purple-400" size={24} strokeWidth={3} />
          <input
            type="text"
            placeholder="Filter by tag..."
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-purple-900 font-bold placeholder-purple-300 text-lg"
          />
        </div>
      </div>

      {loading && notes.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-300 rounded-full"></div>
            <span className="text-purple-500 font-bold text-2xl">Looking...</span>
          </div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-purple-100 border-dashed shadow-sm">
          <div className="bg-amber-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner">
            <FileText size={48} strokeWidth={2.5} />
          </div>
          <h3 className="heading-2 mb-3">No notes found</h3>
          <p className="text-purple-500 font-bold text-xl">Let's create something new!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <Link 
              key={note.id} 
              to={`/notes/${note.id}`} 
              className="card-base card-hover group flex flex-col h-72"
            >
              <h3 className="heading-2 mb-3 group-hover:text-purple-600 transition-colors line-clamp-1 text-xl md:text-2xl">
                {note.title}
              </h3>
              
              <p className="text-purple-600 text-base leading-relaxed line-clamp-3 mb-4 flex-1 font-semibold opacity-80">
                {note.content}
              </p>
              
              <div className="mt-auto space-y-5">
                {note.tags && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0,3).map(tag => (
                      <span key={tag} className="badge-amber">
                        {tag}
                      </span>
                    ))}
                    {note.tags.split(',').filter(Boolean).length > 3 && (
                      <span className="badge-purple">
                        +{note.tags.split(',').filter(Boolean).length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="pt-4 border-t-2 border-purple-50 flex justify-between items-center">
                  <span className="text-sm font-bold text-purple-400">
                    {new Date(note.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={(e) => handleArchiveToggle(note, e)}
                    className="text-sm font-black text-purple-300 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                  >
                    {showArchived ? 'Unarchive' : 'Archive'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
