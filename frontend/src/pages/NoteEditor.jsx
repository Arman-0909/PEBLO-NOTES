import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { BrainCircuit, Globe, Copy, Save, Trash, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function NoteEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [isPublic, setIsPublic] = useState(false);
  const [shareId, setShareId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [activeTab, setActiveTab] = useState('write');

  useEffect(() => {
    if (!isNew) {
      loadNote();
    }
  }, [id]);

  const loadNote = async () => {
    try {
      const res = await api.get('/notes/');
      const note = res.data.notes.find(n => n.id === parseInt(id));
      if (note) {
        setFormData({ title: note.title, content: note.content, tags: note.tags });
        setIsPublic(note.is_public);
        setShareId(note.share_id);
      }
    } catch (err) {
      console.error('Failed to load note');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        const res = await api.post('/notes/', formData);
        navigate(`/notes/${res.data.note.id}`);
      } else {
        await api.put(`/notes/${id}`, formData);
        const btn = document.getElementById('save-btn');
        if (btn) {
          const oldText = btn.innerHTML;
          btn.innerHTML = 'Saved!';
          btn.classList.add('bg-emerald-400', 'border-emerald-600');
          setTimeout(() => {
            btn.innerHTML = oldText;
            btn.classList.remove('bg-emerald-400', 'border-emerald-600');
          }, 2000);
        }
      }
    } catch (err) {
      alert('Failed to save note.');
    }
  };

  // Keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, isNew, id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      navigate('/notes');
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const handleToggleShare = async () => {
    try {
      const res = await api.patch(`/notes/${id}/share`);
      setIsPublic(res.data.public);
      setShareId(res.data.share_id);
    } catch (err) {
      alert('Failed to update sharing.');
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.content.trim()) return alert('Note is empty!');
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await api.post(`/notes/${id}/generate-ai`);
      if (res.data.ai_response.error) {
        alert(res.data.ai_response.error);
      } else {
        setAiResult(res.data.ai_response);
      }
    } catch (err) {
      alert('AI generation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/notes')}
          className="text-purple-500 hover:text-purple-700 flex items-center gap-2 font-black bg-white px-5 py-3 rounded-2xl border-b-4 border-purple-200 shadow-sm active:border-b-0 active:translate-y-1 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} /> Back
        </button>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isNew && (
            <button 
              onClick={handleDelete} 
              className="flex-1 sm:flex-none bg-red-100 text-red-600 px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-200 border-b-4 border-red-200 hover:border-red-300 transition-all active:border-b-0 active:translate-y-1"
            >
              <Trash size={20} strokeWidth={3} /> Delete
            </button>
          )}
          <button 
            id="save-btn"
            onClick={handleSave} 
            className="flex-1 sm:flex-none btn-bubbly-primary px-10 flex justify-center items-center gap-2 text-xl"
          >
            <Save size={20} strokeWidth={3} /> Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 card-base flex flex-col min-h-[60vh] p-8 md:p-10">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Untitled Adventure"
            className="w-full text-4xl md:text-5xl font-black text-purple-900 border-none outline-none placeholder-purple-200 mb-6 bg-transparent tracking-tight"
          />
          
          <div className="flex items-center gap-3 mb-8">
            <div className="badge-amber text-base px-5 py-2">
              Tags
            </div>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. science, math, exam"
              className="flex-1 text-lg text-purple-600 font-bold border-none outline-none placeholder-purple-200 bg-transparent"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-6 py-2 font-black rounded-xl transition-all border-b-2 ${
                activeTab === 'write' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'text-purple-400 border-transparent hover:bg-purple-50'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-2 font-black rounded-xl transition-all border-b-2 ${
                activeTab === 'preview' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'text-purple-400 border-transparent hover:bg-purple-50'
              }`}
            >
              Preview
            </button>
          </div>

          <div className="h-1 bg-purple-50 w-full mb-8 rounded-full"></div>

          {activeTab === 'write' ? (
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Start writing your amazing notes here using Markdown... (Ctrl+S to save)"
              className="w-full flex-1 resize-none border-none outline-none text-purple-800 font-semibold leading-relaxed text-xl bg-transparent placeholder-purple-200"
            />
          ) : (
            <div className="flex-1 prose prose-purple prose-lg max-w-none font-bold opacity-90 overflow-y-auto">
              <ReactMarkdown>{formData.content || '*Nothing to preview yet!*'}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isNew && (
          <div className="space-y-6">
            
            <div className="bg-amber-400 rounded-[2.5rem] p-1.5 shadow-md border-b-8 border-amber-500">
              <div className="bg-white p-6 rounded-[2rem] h-full">
                <div className="flex items-center gap-3 mb-4 text-amber-500">
                  <div className="bg-amber-100 p-3 rounded-2xl border-b-2 border-amber-200">
                    <BrainCircuit size={28} strokeWidth={3} />
                  </div>
                  <h3 className="heading-2">Tutor AI</h3>
                </div>
                
                <p className="text-purple-500 text-base font-bold mb-6">
                  Let AI summarize your notes and extract key action items instantly.
                </p>

                <button 
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  className="w-full btn-bubbly-primary py-4 text-lg flex justify-center items-center gap-2"
                >
                  {aiLoading ? (
                    <span className="animate-pulse">Thinking...</span>
                  ) : (
                    <>Generate Insights <Sparkles size={20} className="text-amber-300" strokeWidth={3} /></>
                  )}
                </button>

                {aiResult && (
                  <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-purple-50 p-5 rounded-3xl border-2 border-purple-100">
                      <span className="text-sm font-black text-purple-400 uppercase tracking-wider mb-2 block">Summary</span>
                      <p className="text-purple-900 font-bold leading-relaxed">{aiResult.summary}</p>
                    </div>
                    
                    {aiResult.action_items && aiResult.action_items.length > 0 && (
                      <div className="bg-amber-50 p-5 rounded-3xl border-2 border-amber-100">
                        <span className="text-sm font-black text-amber-500 uppercase tracking-wider mb-3 block">Action Items</span>
                        <ul className="space-y-3">
                          {aiResult.action_items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-amber-900 font-bold text-base">
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0 shadow-sm"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <div className="bg-emerald-100 p-3 rounded-2xl border-b-2 border-emerald-200">
                  <Globe size={28} strokeWidth={3} />
                </div>
                <h3 className="heading-2">Share</h3>
              </div>
              
              <p className="text-purple-500 text-base font-bold mb-6">
                Make this note public so anyone with the link can read it.
              </p>

              <button 
                onClick={handleToggleShare}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all mb-5 border-b-4 active:border-b-0 active:translate-y-1 ${
                  isPublic 
                    ? 'bg-emerald-400 text-white border-emerald-600 hover:bg-emerald-500' 
                    : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {isPublic ? 'Sharing is On!' : 'Turn On Sharing'}
              </button>

              {isPublic && (
                <div className="flex items-center justify-between bg-purple-50 border-2 border-purple-100 p-2 rounded-2xl">
                  <span className="text-sm font-bold text-purple-400 truncate px-3">
                    .../share/{shareId?.substring(0,8)}...
                  </span>
                  <button 
                    onClick={copyShareLink} 
                    className="bg-white border-2 border-purple-200 text-purple-600 hover:text-amber-500 hover:border-amber-300 p-3 rounded-xl shadow-sm transition-colors"
                    title="Copy Link"
                  >
                    <Copy size={20} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function Sparkles(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size||24} height={props.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth||2} strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
