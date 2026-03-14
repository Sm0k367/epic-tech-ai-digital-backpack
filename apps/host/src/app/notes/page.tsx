'use client';
import { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/AppShell';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Plus, Search, Pin, Trash2, Edit3, Tag, StickyNote, X } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { generateId, formatDate, cn } from '@/lib/utils';
import type { Note } from '@/types';

const NOTE_COLORS = [
  { name: 'default', bg: 'bg-[#0d1117]', border: 'border-white/08' },
  { name: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { name: 'green', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { name: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { name: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { name: 'pink', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { name: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

function getColorClasses(color: string) {
  return NOTE_COLORS.find(c => c.name === color) || NOTE_COLORS[0];
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: '', content: '', tags: '', color: 'default' });
  const { toast } = useToast();

  useEffect(() => {
    setNotes(getItem<Note[]>(STORAGE_KEYS.NOTES, []));
  }, []);

  const save = useCallback((updated: Note[]) => {
    setNotes(updated);
    setItem(STORAGE_KEYS.NOTES, updated);
  }, []);

  const openNew = () => {
    setEditNote(null);
    setForm({ title: '', content: '', tags: '', color: 'default' });
    setModalOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditNote(note);
    setForm({ title: note.title, content: note.content, tags: note.tags.join(', '), color: note.color });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { toast('Title is required', 'error'); return; }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const now = new Date().toISOString();
    if (editNote) {
      const updated = notes.map(n => n.id === editNote.id
        ? { ...n, title: form.title, content: form.content, tags, color: form.color, updatedAt: now }
        : n
      );
      save(updated);
      toast('Note updated', 'success');
    } else {
      const note: Note = {
        id: generateId(), title: form.title, content: form.content,
        tags, color: form.color, pinned: false, createdAt: now, updatedAt: now,
      };
      save([note, ...notes]);
      toast('Note created', 'success');
    }
    setModalOpen(false);
  };

  const deleteNote = (id: string) => {
    save(notes.filter(n => n.id !== id));
    toast('Note deleted', 'info');
  };

  const togglePin = (id: string) => {
    save(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const pinned = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <StickyNote className="text-yellow-400" size={24} /> Smart Notes
            </h1>
            <p className="text-sm text-white/40 mt-0.5">{notes.length} notes · stored locally</p>
          </div>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Note
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            className="input-field pl-9"
            placeholder="Search notes, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Empty state */}
        {notes.length === 0 && (
          <div className="text-center py-20">
            <StickyNote size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg font-medium">No notes yet</p>
            <p className="text-white/20 text-sm mt-1">Click New Note to get started</p>
          </div>
        )}

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Pin size={12} /> Pinned
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {pinned.map(note => <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={deleteNote} onPin={togglePin} />)}
            </div>
          </div>
        )}

        {/* All notes */}
        {unpinned.length > 0 && (
          <div>
            {pinned.length > 0 && (
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Others</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {unpinned.map(note => <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={deleteNote} onPin={togglePin} />)}
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editNote ? 'Edit Note' : 'New Note'} size="lg">
          <div className="space-y-3">
            <input
              className="input-field"
              placeholder="Note title..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
            />
            <textarea
              className="input-field min-h-[160px] resize-none"
              placeholder="Write your note here..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
            <input
              className="input-field"
              placeholder="Tags (comma separated): work, ideas, study"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            />
            {/* Color picker */}
            <div>
              <label className="text-xs text-white/40 mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setForm(f => ({ ...f, color: c.name }))}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-all',
                      c.bg,
                      form.color === c.name ? 'border-cyan-400 scale-110' : 'border-white/20'
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSubmit} className="btn-primary flex-1">
                {editNote ? 'Save Changes' : 'Create Note'}
              </button>
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}

function NoteCard({ note, onEdit, onDelete, onPin }: {
  note: Note;
  onEdit: (n: Note) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}) {
  const { bg, border } = getColorClasses(note.color);
  return (
    <div className={cn('group rounded-xl p-4 border transition-all duration-200 hover:scale-[1.01]', bg, border)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 flex-1">{note.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onPin(note.id)} className={cn('p-1 rounded hover:bg-white/10 transition-colors', note.pinned ? 'text-yellow-400' : 'text-white/30')}>
            <Pin size={13} />
          </button>
          <button onClick={() => onEdit(note)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
            <Edit3 size={13} />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {note.content && (
        <p className="text-xs text-white/50 line-clamp-4 leading-relaxed mb-3 whitespace-pre-wrap">{note.content}</p>
      )}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/05 text-white/40 border border-white/08">
              <Tag size={9} />{tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-[10px] text-white/25">{formatDate(note.updatedAt)}</p>
    </div>
  );
}
