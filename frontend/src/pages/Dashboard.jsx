import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FileText, Archive, Globe, Activity, BrainCircuit, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await api.get('/dashboard/');
      setData(res.data);
    } catch {
      console.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-purple-300 rounded-full"></div>
        <p className="text-purple-500 font-bold text-xl">Packing your backpack...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center text-red-500 font-bold text-xl">
      Oops! Failed to load data.
    </div>
  );

  return (
    <div className="space-y-10 py-6">

      <div className="bg-gradient-to-r from-purple-500 to-violet-400 p-8 md:p-10 rounded-[3rem] border-b-8 border-purple-700 shadow-lg text-white">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
          Hello, {data.username}!
        </h1>
        <p className="text-purple-100 mt-4 text-xl font-bold">Ready to discover something new today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Notes"    value={data.stats.active}    icon={<FileText strokeWidth={3} />}     color="purple" />
        <StatCard title="AI Insights"     value={data.stats.ai_usage}  icon={<BrainCircuit strokeWidth={3} />} color="amber" />
        <StatCard title="Shared Publicly" value={data.stats.public}    icon={<Globe strokeWidth={3} />}        color="emerald" />
        <StatCard title="Archived"        value={data.stats.archived}  icon={<Archive strokeWidth={3} />}      color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="card-base">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-2 flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 p-3 rounded-2xl">
                <Activity size={24} strokeWidth={3} />
              </div>
              Jump Back In
            </h2>
            <Link to="/notes" className="btn-bubbly-primary py-2 px-4 text-sm flex items-center gap-1">
              View All <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>

          {data.recent_notes.length === 0 ? (
            <div className="empty-state-dashed">
              <p className="text-purple-500 dark:text-purple-400 font-bold text-lg mb-2">
                Your backpack is empty!
              </p>
              <Link to="/notes/new" className="text-amber-500 font-black hover:underline text-xl inline-block">
                Create a note
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {data.recent_notes.map(note => (
                <li key={note.id}>
                  <Link to={`/notes/${note.id}`} className="list-card block">
                    <h3 className="font-bold text-xl text-purple-900 dark:text-purple-100">
                      {note.title}
                    </h3>
                    <p className="text-sm text-purple-500 dark:text-purple-400 mt-1 font-bold">
                      Edited {new Date(note.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-base">
          <h2 className="heading-2 mb-8 flex items-center gap-3">
            <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 p-3 rounded-2xl">
              <FileText size={24} strokeWidth={3} />
            </div>
            Top Topics
          </h2>

          {data.most_used_tags.length === 0 ? (
            <p className="text-purple-400 text-center py-8 font-bold text-lg">No tags used yet.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {data.most_used_tags.map(({ tag, count }) => (
                <div key={tag} className="tag-pill">
                  <span className="font-black text-lg">{tag}</span>
                  <span className="bg-amber-400 dark:bg-amber-600 text-amber-900 dark:text-amber-100 font-black text-sm px-3 py-1 rounded-xl">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="mb-4">
        <div className={`stat-icon-${color}`}>{icon}</div>
      </div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{title}</p>
      </div>
    </div>
  );
}
