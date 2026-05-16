import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { BrainCircuit, Globe, Copy, Save, Trash, ChevronLeft, Sparkles } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew) loadNote();
  }, [id]);

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [formData, isNew, id]);

  async function loadNote() {
    try {
      const res = await api.get(`/notes/${id}`);
      const note = res.data;
      setFormData({ title: note.title, content: note.content, tags: note.tags });
      setIsPublic(note.is_public);
      setShareId(note.share_id);
    } catch {
      navigate('/notes');
    }
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (isNew) {
        const res = await api.post('/notes/', formData);
        navigate(`/notes/${res.data.note.id}`);
      } else {
        await api.put(`/notes/${id}`, formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      alert('Failed to save note.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      navigate('/notes');
    } catch {
      alert('Failed to delete.');
    }
  }

  async function handleToggleShare() {
    try {
      const res = await api.patch(`/notes/${id}/share`);
      setIsPublic(res.data.public);
      setShareId(res.data.share_id);
    } catch {
      alert('Failed to update sharing.');
    }
  }

  async function handleGenerateAI() {
    if (!formData.content.trim()) {
      alert('Note is empty!');
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await api.post(`/notes/${id}/generate-ai`);
      if (res.data.ai_response.error) {
        alert(res.data.ai_response.error);
      } else {
        setAiResult(res.data.ai_response);
      }
    } catch {
      alert('AI generation failed.');
    } finally {
      setAiLoading(false);
    }
  }

  function copyShareLink() {
    navigator.clipboard.writeText(`${window.location.origin}/share/${shareId}`);
    alert('Link copied to clipboard!');
  }

  function goBack() {
    navigate('/notes');
  }

  const saveButtonClass = saved
    ? 'flex-1 sm:flex-none btn-bubbly-primary px-10 flex justify-center items-center gap-2 text-xl bg-emerald-400 border-emerald-600'
    : 'flex-1 sm:flex-none btn-bubbly-primary px-10 flex justify-center items-center gap-2 text-xl';

  function getSaveLabel() {
    if (saving) return 'Saving...';
    if (saved) return 'Saved!';
    return 'Save';
  }

  const shareButtonClass = isPublic
    ? 'w-full py-4 rounded-2xl font-black text-lg transition-all mb-5 border-b-4 active:border-b-0 active:translate-y-1 bg-emerald-400 dark:bg-emerald-500 text-white border-emerald-600'
    : 'w-full py-4 rounded-2xl font-black text-lg transition-all mb-5 border-b-4 active:border-b-0 active:translate-y-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600';

  return (
    <div className="space-y-6 py-4">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button onClick={goBack} className="btn-outline flex items-center gap-2">
          <ChevronLeft size={20} strokeWidth={3} /> Back
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isNew && (
            <button onClick={handleDelete} className="btn-danger">
              <Trash size={20} strokeWidth={3} /> Delete
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
            <Save size={20} strokeWidth={3} /> {getSaveLabel()}
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
            className="w-full text-4xl md:text-5xl font-black text-purple-900 dark:text-white border-none outline-none placeholder-purple-200 dark:placeholder-slate-500 mb-6 bg-transparent tracking-tight"
          />

          <div className="flex items-center gap-3 mb-8">
            <div className="badge-amber text-base px-5 py-2">Tags</div>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. science, math, exam"
              className="flex-1 text-lg text-purple-600 dark:text-slate-300 font-bold border-none outline-none placeholder-purple-200 dark:placeholder-slate-500 bg-transparent"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('write')}
              className={activeTab === 'write' ? 'tab-btn-active' : 'tab-btn'}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={activeTab === 'preview' ? 'tab-btn-active' : 'tab-btn'}
            >
              Preview
            </button>
          </div>

          <div className="h-1 bg-purple-50 dark:bg-slate-700 w-full mb-8 rounded-full"></div>

          {activeTab === 'write' ? (
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Start writing your amazing notes here using Markdown... (Ctrl+S to save)"
              className="w-full flex-1 resize-none border-none outline-none text-purple-800 dark:text-slate-200 font-semibold leading-relaxed text-xl bg-transparent placeholder-purple-200 dark:placeholder-slate-500"
            />
          ) : (
            <div className="flex-1 prose prose-purple prose-lg max-w-none font-bold opacity-90 overflow-y-auto">
              <ReactMarkdown>{formData.content || '*Nothing to preview yet!*'}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isNew && (
          <div className="space-y-6">

            <div className="bg-amber-400 dark:bg-amber-500/80 rounded-[2.5rem] p-1.5 shadow-md border-b-8 border-amber-500 dark:border-amber-600/80">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem]">
                <div className="flex items-center gap-3 mb-4 text-amber-500 dark:text-amber-400">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-2xl border-b-2 border-amber-200 dark:border-amber-900/50">
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
                  {aiLoading
                    ? <span className="animate-pulse">Thinking...</span>
                    : <><Sparkles size={20} className="text-amber-300" strokeWidth={3} /> Generate Insights</>
                  }
                </button>

                {aiResult && (
                  <div className="mt-6 space-y-5">
                    {aiResult.suggested_title && (
                      <div className="card-inner">
                        <span className="text-sm font-black text-purple-400 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                          Suggested Title
                        </span>
                        <p className="text-purple-900 dark:text-slate-200 font-bold leading-relaxed">
                          {aiResult.suggested_title}
                        </p>
                      </div>
                    )}
                    <div className="card-inner">
                      <span className="text-sm font-black text-purple-400 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                        Summary
                      </span>
                      <p className="text-purple-900 dark:text-slate-200 font-bold leading-relaxed">
                        {aiResult.summary}
                      </p>
                    </div>

                    {aiResult.action_items?.length > 0 && (
                      <div className="card-inner-amber">
                        <span className="text-sm font-black text-amber-500 dark:text-amber-400 uppercase tracking-wider mb-3 block">
                          Action Items
                        </span>
                        <ul className="space-y-3">
                          {aiResult.action_items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-amber-900 dark:text-amber-100 font-bold text-base">
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-500 mt-1.5 flex-shrink-0"></div>
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
              <div className="flex items-center gap-3 mb-4 text-emerald-500 dark:text-emerald-400">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-2xl border-b-2 border-emerald-200 dark:border-emerald-900/50">
                  <Globe size={28} strokeWidth={3} />
                </div>
                <h3 className="heading-2">Share</h3>
              </div>

              <p className="text-purple-500 text-base font-bold mb-6">
                Make this note public so anyone with the link can read it.
              </p>

              <button onClick={handleToggleShare} className={shareButtonClass}>
                {isPublic ? 'Sharing is On!' : 'Turn On Sharing'}
              </button>

              {isPublic && (
                <div className="card-inner flex items-center justify-between p-2">
                  <span className="text-sm font-bold text-purple-400 dark:text-slate-400 truncate px-3">
                    .../share/{shareId?.substring(0, 8)}...
                  </span>
                  <button onClick={copyShareLink} className="btn-icon" title="Copy Link">
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
