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

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [search, tagFilter, showArchived]);

  async function fetchNotes() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ is_archived: showArchived });
      if (search) params.append('search', search);
      if (tagFilter) params.append('tag', tagFilter);
      const res = await api.get(`/notes/?${params}`);
      setNotes(res.data.notes);
    } catch {
      console.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }

  async function toggleArchive(note, e) {
    e.preventDefault();
    try {
      await api.patch(`/notes/${note.id}/${showArchived ? 'unarchive' : 'archive'}`);
      setNotes(notes.filter(n => n.id !== note.id));
    } catch {
      alert('Failed to update note.');
    }
  }

  function getTags(note) {
    return note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  }

  return (
    <div className="space-y-8 py-4">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="heading-1">My Workspace</h1>
          <p className="text-purple-500 dark:text-slate-400 font-bold mt-2 text-lg">Organize all your awesome ideas!</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowArchived(!showArchived)} className="btn-outline">
            {showArchived ? 'View Active' : 'View Archived'}
          </button>
          <Link to="/notes/new" className="btn-bubbly-primary flex items-center gap-2">
            <Plus size={24} strokeWidth={3} /> <span className="text-xl">New Note</span>
          </Link>
        </div>
      </div>

      <div className="search-wrapper">
        <div className="input-wrapper flex-1">
          <Search className="input-icon" size={24} strokeWidth={3} />
          <input type="text" placeholder="Search your notes..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" />
        </div>
        <div className="input-wrapper sm:w-80">
          <Filter className="input-icon" size={24} strokeWidth={3} />
          <input type="text" placeholder="Filter by tag..." value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="input-field" />
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
        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-purple-100 dark:border-slate-700 border-dashed shadow-sm transition-colors">
          <div className="bg-amber-100 dark:bg-amber-900/30 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-500 dark:text-amber-400">
            <FileText size={48} strokeWidth={2.5} />
          </div>
          <h3 className="heading-2 mb-3">No notes found</h3>
          <p className="text-purple-500 font-bold text-xl">Let's create something new!</p>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => {
            const tags = getTags(note);
            return (
              <Link key={note.id} to={`/notes/${note.id}`} className="list-card group flex flex-col h-72">
                <h3 className="heading-2 mb-3 group-hover:text-purple-600 transition-colors line-clamp-1 text-xl md:text-2xl">
                  {note.title}
                </h3>
                <p className="text-purple-600 dark:text-slate-300 text-base leading-relaxed line-clamp-3 mb-4 flex-1 font-semibold opacity-80">
                  {note.content}
                </p>
                <div className="mt-auto space-y-5">
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 3).map(tag => <span key={tag} className="badge-amber">{tag}</span>)}
                      {tags.length > 3 && <span className="badge-purple">+{tags.length - 3}</span>}
                    </div>
                  )}
                  <div className="pt-4 border-t-2 border-purple-50 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-sm font-bold text-purple-400 dark:text-slate-400">
                      {new Date(note.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button onClick={e => toggleArchive(note, e)} className="btn-danger-text">
                      {showArchived ? 'Unarchive' : 'Archive'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
