'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/AppShell';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Plus, CheckSquare, Trash2, Edit3, Calendar, Flag, X, Search, GripVertical } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { generateId, formatDate, cn } from '@/lib/utils';
import type { Task, TaskStatus, TaskPriority } from '@/types';

const STATUSES: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'text-slate-400' },
  { key: 'in-progress', label: 'In Progress', color: 'text-yellow-400' },
  { key: 'done', label: 'Done', color: 'text-green-400' },
];

const PRIORITIES: { key: TaskPriority; label: string; color: string }[] = [
  { key: 'low', label: 'Low', color: 'text-green-400' },
  { key: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { key: 'high', label: 'High', color: 'text-orange-400' },
  { key: 'urgent', label: 'Urgent', color: 'text-red-400' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus, dueDate: '', tags: '',
  });
  const { toast } = useToast();

  useEffect(() => { setTasks(getItem<Task[]>(STORAGE_KEYS.TASKS, [])); }, []);

  const save = useCallback((updated: Task[]) => {
    setTasks(updated);
    setItem(STORAGE_KEYS.TASKS, updated);
  }, []);

  const openNew = (status: TaskStatus = 'todo') => {
    setEditTask(null);
    setForm({ title: '', description: '', priority: 'medium', status, dueDate: '', tags: '' });
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setForm({
      title: task.title, description: task.description,
      priority: task.priority, status: task.status,
      dueDate: task.dueDate || '', tags: task.tags.join(', '),
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { toast('Title is required', 'error'); return; }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const now = new Date().toISOString();
    if (editTask) {
      save(tasks.map(t => t.id === editTask.id
        ? { ...t, ...form, tags, updatedAt: now }
        : t
      ));
      toast('Task updated', 'success');
    } else {
      const task: Task = {
        id: generateId(), ...form, tags,
        createdAt: now, updatedAt: now,
      };
      save([task, ...tasks]);
      toast('Task created', 'success');
    }
    setModalOpen(false);
  };

  const deleteTask = (id: string) => {
    save(tasks.filter(t => t.id !== id));
    toast('Task deleted', 'info');
  };

  const moveTask = (id: string, status: TaskStatus) => {
    save(tasks.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  };

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="text-green-400" size={24} /> Task Manager
            </h1>
            <p className="text-sm text-white/40 mt-0.5">{tasks.length} tasks · {counts.done} completed</p>
          </div>
          <button onClick={() => openNew()} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Task
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input className="input-field pl-9" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={14} /></button>}
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.map(({ key, label, color }) => {
            const colTasks = filtered.filter(t => t.status === key);
            return (
              <div key={key} className="rounded-xl bg-[#0a0a0f] border border-white/08 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/08">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-semibold', color)}>{label}</span>
                    <span className="text-xs bg-white/08 text-white/40 px-2 py-0.5 rounded-full">{counts[key]}</span>
                  </div>
                  <button onClick={() => openNew(key)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="p-3 space-y-2 min-h-[200px]">
                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-white/20 text-xs">No tasks</div>
                  )}
                  {colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEdit}
                      onDelete={deleteTask}
                      onMove={moveTask}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTask ? 'Edit Task' : 'New Task'} size="md">
          <div className="space-y-3">
            <input className="input-field" placeholder="Task title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            <textarea className="input-field min-h-[80px] resize-none" placeholder="Description (optional)..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Priority</label>
                <select className="input-field" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                  {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}>
                  {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Due Date</label>
              <input type="date" className="input-field" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <input className="input-field" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            <div className="flex gap-2 pt-2">
              <button onClick={handleSubmit} className="btn-primary flex-1">{editTask ? 'Save Changes' : 'Create Task'}</button>
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}

function TaskCard({ task, onEdit, onDelete, onMove }: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, s: TaskStatus) => void;
}) {
  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': null,
  };
  const next = nextStatus[task.status];

  return (
    <div className="group rounded-lg p-3 bg-[#0d1117] border border-white/08 hover:border-white/15 transition-all">
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="text-white/20 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <p className={cn('text-sm font-medium leading-tight', task.status === 'done' && 'line-through text-white/40')}>
              {task.title}
            </p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => onEdit(task)} className="p-0.5 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
                <Edit3 size={12} />
              </button>
              <button onClick={() => onDelete(task.id)} className="p-0.5 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          {task.description && <p className="text-xs text-white/40 mt-1 line-clamp-2">{task.description}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-medium', priorityBg[task.priority])}>
              <Flag size={9} className="inline mr-0.5" />{task.priority}
            </span>
            {task.dueDate && (
              <span className="text-[10px] text-white/30 flex items-center gap-0.5">
                <Calendar size={9} />{formatDate(task.dueDate)}
              </span>
            )}
            {next && (
              <button
                onClick={() => onMove(task.id, next)}
                className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors ml-auto"
              >
                → {next === 'in-progress' ? 'Start' : 'Done'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const priorityBg: Record<TaskPriority, string> = {
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
};
