'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/AppShell';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Plus, Code2, Trash2, Edit3, Copy, Check, Search, X, Tag } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { generateId, formatDate, cn } from '@/lib/utils';
import type { CodeSnippet } from '@/types';

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'rust', 'go', 'java', 'c', 'cpp',
  'csharp', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql',
  'bash', 'json', 'yaml', 'markdown', 'other'
];

const LANG_COLORS: Record<string, string> = {
  javascript: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  typescript: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  python: 'text-green-400 bg-green-500/10 border-green-500/20',
  rust: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  go: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  html: 'text-red-400 bg-red-500/10 border-red-500/20',
  css: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  sql: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  bash: 'text-green-300 bg-green-500/10 border-green-500/20',
};

function getLangColor(lang: string) {
  return LANG_COLORS[lang] || 'text-white/50 bg-white/05 border-white/10';
}

export default function CodeVaultPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editSnippet, setEditSnippet] = useState<CodeSnippet | null>(null);
  const [viewSnippet, setViewSnippet] = useState<CodeSnippet | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', code: '', language: 'javascript', description: '', tags: '' });
  const { toast } = useToast();

  useEffect(() => { setSnippets(getItem<CodeSnippet[]>(STORAGE_KEYS.CODE_SNIPPETS, [])); }, []);

  const save = useCallback((updated: CodeSnippet[]) => {
    setSnippets(updated);
    setItem(STORAGE_KEYS.CODE_SNIPPETS, updated);
  }, []);

  const openNew = () => {
    setEditSnippet(null);
    setForm({ title: '', code: '', language: 'javascript', description: '', tags: '' });
    setModalOpen(true);
  };

  const openEdit = (s: CodeSnippet) => {
    setEditSnippet(s);
    setForm({ title: s.title, code: s.code, language: s.language, description: s.description, tags: s.tags.join(', ') });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.code.trim()) { toast('Title and code are required', 'error'); return; }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const now = new Date().toISOString();
    if (editSnippet) {
      save(snippets.map(s => s.id === editSnippet.id ? { ...s, ...form, tags, updatedAt: now } : s));
      toast('Snippet updated', 'success');
    } else {
      save([{ id: generateId(), ...form, tags, createdAt: now, updatedAt: now }, ...snippets]);
      toast('Snippet saved', 'success');
    }
    setModalOpen(false);
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast('Code copied!', 'success');
  };

  const langs = [...new Set(snippets.map(s => s.language))];

  const filtered = snippets.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchLang = !filterLang || s.language === filterLang;
    return matchSearch && matchLang;
  });

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code2 className="text-blue-400" size={24} /> Code Vault
            </h1>
            <p className="text-sm text-white/40 mt-0.5">{snippets.length} snippets · {langs.length} languages</p>
          </div>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Save Snippet
          </button>
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input className="input-field pl-9" placeholder="Search snippets..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={14} /></button>}
          </div>
          <select className="input-field w-auto" value={filterLang} onChange={e => setFilterLang(e.target.value)}>
            <option value="">All Languages</option>
            {langs.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Empty state */}
        {snippets.length === 0 && (
          <div className="text-center py-20">
            <Code2 size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg font-medium">No snippets yet</p>
            <p className="text-white/20 text-sm mt-1">Save your first code snippet</p>
          </div>
        )}

        {/* Snippets grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(snippet => (
            <div key={snippet.id} className="group card hover:border-blue-500/20 cursor-pointer" onClick={() => setViewSnippet(snippet)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{snippet.title}</h3>
                  {snippet.description && <p className="text-xs text-white/40 mt-0.5 truncate">{snippet.description}</p>}
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-medium', getLangColor(snippet.language))}>
                    {snippet.language}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); copyCode(snippet.id, snippet.code); }} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
                      {copiedId === snippet.id ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); openEdit(snippet); }} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); save(snippets.filter(s => s.id !== snippet.id)); toast('Deleted', 'info'); }} className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
              <pre className="code-block text-xs max-h-[100px] overflow-hidden text-white/70 text-ellipsis">
                <code>{snippet.code.slice(0, 300)}{snippet.code.length > 300 ? '\n...' : ''}</code>
              </pre>
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {snippet.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/05 text-white/40 border border-white/08">
                      <Tag size={9} />{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-white/25 mt-2">{formatDate(snippet.updatedAt)}</p>
            </div>
          ))}
        </div>

        {/* View Modal */}
        {viewSnippet && (
          <Modal isOpen={!!viewSnippet} onClose={() => setViewSnippet(null)} title={viewSnippet.title} size="xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs px-2 py-0.5 rounded border font-medium', getLangColor(viewSnippet.language))}>
                  {viewSnippet.language}
                </span>
                {viewSnippet.description && <span className="text-xs text-white/40">{viewSnippet.description}</span>}
              </div>
              <div className="relative">
                <pre className="code-block text-sm max-h-[400px] overflow-auto">
                  <code>{viewSnippet.code}</code>
                </pre>
                <button
                  onClick={() => copyCode(viewSnippet.id, viewSnippet.code)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                >
                  {copiedId === viewSnippet.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setViewSnippet(null); openEdit(viewSnippet); }} className="btn-secondary flex items-center gap-2 text-xs">
                  <Edit3 size={13} /> Edit
                </button>
                <button onClick={() => setViewSnippet(null)} className="btn-secondary text-xs">Close</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit/Create Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editSnippet ? 'Edit Snippet' : 'Save Snippet'} size="xl">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" placeholder="Snippet title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
              <select className="input-field" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <input className="input-field" placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <textarea
              className="input-field min-h-[200px] resize-none font-mono text-sm"
              placeholder="Paste your code here..."
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
            />
            <input className="input-field" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            <div className="flex gap-2 pt-2">
              <button onClick={handleSubmit} className="btn-primary flex-1">{editSnippet ? 'Save Changes' : 'Save Snippet'}</button>
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
