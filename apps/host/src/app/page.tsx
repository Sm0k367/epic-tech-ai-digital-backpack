import { AppShell } from '@/components/AppShell';
import {
  StickyNote, CheckSquare, Brain, MessageSquare,
  Code2, Music, Gamepad2, Zap, Globe, Key,
  ArrowRight, Star, Shield, Cpu
} from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    href: '/notes',
    label: 'Smart Notes',
    icon: StickyNote,
    description: 'Rich markdown notes with tags, colors & search',
    color: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
    badge: 'Free',
  },
  {
    href: '/tasks',
    label: 'Task Manager',
    icon: CheckSquare,
    description: 'Kanban-style tasks with priorities & due dates',
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/20',
    iconColor: 'text-green-400',
    badge: 'Free',
  },
  {
    href: '/flashcards',
    label: 'Flashcards',
    icon: Brain,
    description: 'Spaced-repetition study cards with decks',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    badge: 'Free',
  },
  {
    href: '/chat-nexus',
    label: 'Chat Nexus',
    icon: MessageSquare,
    description: 'AI assistant with persistent conversation history',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    badge: 'Free + API',
  },
  {
    href: '/code-vault',
    label: 'Code Vault',
    icon: Code2,
    description: 'Save, organize & search code snippets by language',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    badge: 'Free',
  },
  {
    href: '/music-vault',
    label: 'Music Vault',
    icon: Music,
    description: 'Curated lo-fi & focus music player with playlists',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/20',
    iconColor: 'text-pink-400',
    badge: 'Free',
  },
  {
    href: '/game-labs',
    label: 'Game Labs',
    icon: Gamepad2,
    description: 'Mini productivity games: typing, memory & focus',
    color: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/20',
    iconColor: 'text-orange-400',
    badge: 'Free',
  },
  {
    href: '/api-docs',
    label: 'API Access',
    icon: Globe,
    description: 'Full REST API — integrate into your own apps',
    color: 'from-teal-500/20 to-cyan-500/20',
    border: 'border-teal-500/20',
    iconColor: 'text-teal-400',
    badge: 'API',
  },
];

const stats = [
  { label: 'Tools Available', value: '8', icon: Zap },
  { label: 'API Endpoints', value: '12+', icon: Globe },
  { label: 'Free Forever', value: '100%', icon: Star },
  { label: 'No Login Required', value: 'True', icon: Shield },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="min-h-screen hero-bg grid-bg">
        {/* Hero */}
        <div className="px-8 pt-16 pb-10 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/20 text-xs text-cyan-400 mb-6">
            <Zap size={12} />
            <span>Zero config · Works offline · Free forever</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="text-white">Epic Tech AI</span>
            <br />
            <span className="text-gradient">Digital Backpack</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
            Your all-in-one AI-powered productivity suite. Notes, tasks, flashcards,
            code snippets, AI chat, music & games — all free, all in one place.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/notes" className="btn-primary flex items-center gap-2">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link href="/api-docs" className="btn-secondary flex items-center gap-2">
              <Globe size={16} /> View API Docs
            </Link>
            <Link href="/api-keys" className="btn-secondary flex items-center gap-2">
              <Key size={16} /> Get API Key
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="px-8 pb-10">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="card text-center">
                <Icon size={20} className="text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="px-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-white/80 mb-6 flex items-center gap-2">
              <Cpu size={20} className="text-cyan-400" />
              All Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map(({ href, label, icon: Icon, description, color, border, iconColor, badge }) => (
                <Link
                  key={href}
                  href={href}
                  className={`group relative rounded-xl p-4 bg-gradient-to-br ${color} border ${border} hover:scale-[1.02] transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-black/30 ${iconColor}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      badge === 'Free' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                      badge === 'API' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{label}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                    Open <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* API Banner */}
        <div className="px-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Globe size={20} className="text-cyan-400" />
                    REST API Access
                  </h3>
                  <p className="text-sm text-white/50">
                    Integrate Epic Tech AI into your own apps. Free tier: 20 req/hr · API tier: 1000 req/hr
                  </p>
                  <div className="mt-2 font-mono text-xs text-cyan-400 bg-black/30 px-3 py-1.5 rounded-lg inline-block">
                    GET /api/notes · POST /api/chat · GET /api/tasks
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <Link href="/api-docs" className="btn-primary text-xs">View Docs</Link>
                  <Link href="/api-keys" className="btn-secondary text-xs">Get Key</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
