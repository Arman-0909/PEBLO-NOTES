import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FileText, Archive, Globe, Activity, BrainCircuit, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/');
        setData(response.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-purple-300 rounded-full"></div>
        <p className="text-purple-500 font-bold text-xl">Packing your backpack...</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-8 text-center text-red-500 font-bold text-xl">Oops! Failed to load data.</div>;

  return (
    <div className="space-y-10 py-6">
      <div className="bg-gradient-to-r from-purple-500 to-violet-400 p-8 md:p-10 rounded-[3rem] border-b-8 border-purple-700 shadow-lg text-white">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
          Hello, {data.username}!
        </h1>
        <p className="text-purple-100 mt-4 text-xl font-bold">
          Ready to discover something new today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Notes" value={data.stats.active} icon={<FileText strokeWidth={3} />} color="purple" />
        <StatCard title="AI Insights" value={data.stats.ai_usage} icon={<BrainCircuit strokeWidth={3} />} color="amber" />
        <StatCard title="Shared Publicly" value={data.stats.public} icon={<Globe strokeWidth={3} />} color="emerald" />
        <StatCard title="Archived" value={data.stats.archived} icon={<Archive strokeWidth={3} />} color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-base">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-2 flex items-center gap-3">
              <div className="bg-amber-100 text-amber-500 p-3 rounded-2xl">
                <Activity size={24} strokeWidth={3} />
              </div>
              Jump Back In
            </h2>
            <Link to="/notes" className="btn-bubbly-primary py-2 px-4 text-sm flex items-center gap-1">
              View All <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>
          
          {data.recent_notes.length === 0 ? (
            <div className="text-center py-10 bg-purple-50 rounded-[2rem] border-4 border-dashed border-purple-200">
              <p className="text-purple-500 font-bold text-lg mb-2">Your backpack is empty!</p>
              <Link to="/notes/new" className="text-amber-500 font-black hover:underline text-xl inline-block">Create a note</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {data.recent_notes.map(note => (
                <li key={note.id} className="group">
                  <Link to={`/notes/${note.id}`} className="block p-5 rounded-[2rem] bg-purple-50 hover:bg-purple-100 border-b-4 border-purple-200 hover:border-purple-300 transition-all active:border-b-0 active:translate-y-1">
                    <h3 className="font-bold text-xl text-purple-900 group-hover:text-purple-700 transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-sm text-purple-500 mt-1 font-bold">
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
            <div className="bg-pink-100 text-pink-500 p-3 rounded-2xl">
              <FileText size={24} strokeWidth={3} />
            </div>
            Top Topics
          </h2>
          
          {data.most_used_tags.length === 0 ? (
            <p className="text-purple-400 text-center py-8 font-bold text-lg">No tags used yet.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {data.most_used_tags.map(tagObj => (
                <div key={tagObj.tag} className="bg-white border-4 border-amber-200 text-amber-600 px-5 py-3 rounded-3xl flex items-center gap-3 hover:border-amber-400 hover:bg-amber-50 transition-colors shadow-sm">
                  <span className="font-black text-lg">{tagObj.tag}</span>
                  <span className="bg-amber-400 text-amber-900 font-black text-sm px-3 py-1 rounded-xl shadow-sm">
                    {tagObj.count}
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
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    amber: 'bg-amber-100 text-amber-600 border-amber-300',
    emerald: 'bg-emerald-100 text-emerald-600 border-emerald-300',
    slate: 'bg-slate-100 text-slate-500 border-slate-300'
  };

  const textClasses = {
    purple: 'text-purple-900',
    amber: 'text-amber-900',
    emerald: 'text-emerald-900',
    slate: 'text-slate-800'
  };

  return (
    <div className={`bg-white p-6 rounded-[2rem] shadow-md border-b-8 ${colorClasses[color]} flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl bg-white shadow-sm border-2 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-5xl font-black ${textClasses[color]}`}>{value}</p>
        <p className={`text-lg font-bold mt-2 opacity-80 ${textClasses[color]}`}>{title}</p>
      </div>
    </div>
  );
}
