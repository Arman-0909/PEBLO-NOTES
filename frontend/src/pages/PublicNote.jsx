import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import pebloLogo from '../assets/peblo-notes.png';
import ReactMarkdown from 'react-markdown';

export default function PublicNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/notes/share/${shareId}`)
      .then(res => setNote(res.data))
      .catch(() => setError('This note is private or does not exist.'))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-pulse w-16 h-16 bg-purple-300 rounded-full"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto mt-20 card-base text-center">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-[2rem] border-b-4 border-red-200 dark:border-red-900/50 flex items-center justify-center mx-auto mb-8 text-5xl font-black">!</div>
      <h2 className="heading-2 mb-4">Access Denied</h2>
      <p className="text-purple-500 dark:text-purple-400 font-bold text-lg mb-10">{error}</p>
      <Link to="/" className="btn-bubbly-primary text-xl px-10 py-4">Go to Homepage</Link>
    </div>
  );

  const tags = note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-20">

      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-md border-b-4 border-purple-100 dark:border-slate-700 transition-colors">
          <img src={pebloLogo} alt="Peblo Notes" className="h-8 object-contain" />
          <span className="font-black text-purple-800 dark:text-purple-300 text-lg">Shared Note</span>
        </div>
      </div>

      <div className="card-base p-10 md:p-16 border-b-[12px] relative overflow-hidden">
        <div className="share-banner"></div>

        <h1 className="text-4xl md:text-6xl font-black text-purple-900 dark:text-purple-100 mb-8 leading-tight tracking-tight">
          {note.title}
        </h1>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {tags.map(tag => <span key={tag} className="badge-amber px-5 py-2 text-base">{tag}</span>)}
          </div>
        )}

        <div className="prose prose-purple prose-xl max-w-none font-bold opacity-90">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>

        <div className="mt-20 pt-10 border-t-4 border-purple-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center text-base font-black text-purple-300 dark:text-slate-500 gap-6 transition-colors">
          <span>Last updated {new Date(note.updated_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <Link to="/" className="auth-link">Create your own notes</Link>
        </div>
      </div>
    </div>
  );
}
