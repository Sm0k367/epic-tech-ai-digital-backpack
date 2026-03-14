'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Backpack, StickyNote, CheckSquare, Brain, MessageSquare,
  Code2, Music, Gamepad2, Key, BookOpen, Zap, ChevronLeft, ChevronRight, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Backpack },
  { href: '/notes', label: 'Notes', icon: StickyNote },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/flashcards', label: 'Flashcards', icon: Brain },
  { href: '/chat-nexus', label: 'Chat Nexus', icon: MessageSquare },
  { href: '/code-vault', label: 'Code Vault', icon: Code2 },
  { href: '/music-vault', label: 'Music Vault', icon: Music },
  { href: '/game-labs', label: 'Game Labs', icon: Gamepad2 },
];

const bottomItems = [
  { href: '/api-docs', label: 'API Docs', icon: Globe },
  { href: '/api-keys', label: 'API Keys', icon: Key },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      'flex flex-col h-screen sticky top-0 transition-all duration-300 border-r border-white/08',
      'bg-[#0a0a0f]',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-4 border-b border-white/08',
        collapsed && 'justify-center px-2'
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-black" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-white leading-tight">Epic Tech AI</div>
            <div className="text-[10px] text-white/40">Digital Backpack</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                collapsed && 'justify-center px-2',
                active
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/05'
              )}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-white/08 space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                collapsed && 'justify-center px-2',
                active
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/05'
              )}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/05 transition-all',
            collapsed && 'justify-center px-2'
          )}
        >
          {collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
