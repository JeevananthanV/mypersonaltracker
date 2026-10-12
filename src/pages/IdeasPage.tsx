import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Pin,
  Trash2,
  Copy,
  Check,
  Tag,
  Sparkles,
  Search
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { QuickAddModal } from '../components/QuickAddModal';

export const IdeasPage: React.FC = () => {
  const { ideas, deleteIdea, togglePinIdea } = useLifeOS();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', 'AI Prompt', 'App Idea', 'Automation', 'Life Note'];

  const filteredIdeas = ideas.filter(i => {
    if (selectedCategory !== 'all' && i.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.content.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <Lightbulb className="w-7 h-7 text-amber-400" />
            <span>Ideas & Prompt Vault</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Store AI system prompts, side project ideas, automation blueprints, and daily mindset notes.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Capture Idea / Prompt</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search notes, prompts, or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Masonry/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedIdeas.map(idea => (
          <div
            key={idea.id}
            className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              idea.pinned ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  idea.category === 'AI Prompt'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : idea.category === 'App Idea'
                    ? 'bg-violet-500/20 text-violet-300'
                    : idea.category === 'Automation'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {idea.category}
                </span>

                <button
                  onClick={() => togglePinIdea(idea.id)}
                  title={idea.pinned ? 'Unpin' : 'Pin to top'}
                  className={`p-1 rounded transition-colors ${
                    idea.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <h2 className="text-sm font-bold text-white mb-2">{idea.title}</h2>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap select-all max-h-48 overflow-y-auto">
                {idea.content}
              </div>

              {idea.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {idea.tags.map((t, idx) => (
                    <span key={idx} className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">
                      <Tag className="w-2.5 h-2.5 text-slate-500" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">{idea.createdAt}</span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(idea.id, idea.content)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                >
                  {copiedId === idea.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === idea.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuickAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="idea"
      />
    </div>
  );
};
