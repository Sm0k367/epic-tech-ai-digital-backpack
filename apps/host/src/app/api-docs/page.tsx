'use client';
import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Globe, Copy, Check, ChevronDown, ChevronRight, Zap, Shield, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  tier: 'free' | 'api' | 'both';
  body?: string;
  response: string;
  params?: string;
}

const ENDPOINTS: { section: string; endpoints: Endpoint[] }[] = [
  {
    section: 'System',
    endpoints: [
      {
        method: 'GET', path: '/api/health', description: 'Health check — returns server status and tier info',
        tier: 'both',
        response: `{ "success": true, "data": { "status": "ok", "version": "2.0.0", "tier": "free" } }`,
      },
      {
        method: 'GET', path: '/api/status', description: 'Get API status, rate limit info, and available features',
        tier: 'both',
        response: `{ "success": true, "data": { "tier": "free", "rateLimit": { "limit": 20, "remaining": 18 } } }`,
      },
    ],
  },
  {
    section: 'Chat / AI',
    endpoints: [
      {
        method: 'POST', path: '/api/chat', description: 'Send messages to the AI assistant. Free tier returns smart responses; API tier uses full AI.',
        tier: 'both',
        body: `{
  "messages": [
    { "role": "user", "content": "Explain recursion" }
  ]
}`,
        response: `{ "success": true, "data": { "role": "assistant", "content": "Recursion is..." }, "tier": "free" }`,
      },
    ],
  },
  {
    section: 'Notes',
    endpoints: [
      {
        method: 'GET', path: '/api/notes', description: 'List all notes. Supports search and tag filtering.',
        tier: 'both',
        params: '?search=keyword&tag=work&limit=20&offset=0',
        response: `{ "success": true, "data": { "notes": [...], "total": 5 } }`,
      },
      {
        method: 'POST', path: '/api/notes', description: 'Create a new note.',
        tier: 'both',
        body: `{
  "title": "My Note",
  "content": "Note content here",
  "tags": ["work", "ideas"],
  "color": "yellow"
}`,
        response: `{ "success": true, "data": { "id": "abc123", "title": "My Note", ... } }`,
      },
      {
        method: 'PUT', path: '/api/notes/:id', description: 'Update an existing note by ID.',
        tier: 'both',
        body: `{ "title": "Updated Title", "content": "New content" }`,
        response: `{ "success": true, "data": { "id": "abc123", "title": "Updated Title", ... } }`,
      },
      {
        method: 'DELETE', path: '/api/notes/:id', description: 'Delete a note by ID.',
        tier: 'both',
        response: `{ "success": true, "data": { "deleted": true } }`,
      },
    ],
  },
  {
    section: 'Tasks',
    endpoints: [
      {
        method: 'GET', path: '/api/tasks', description: 'List all tasks. Filter by status or priority.',
        tier: 'both',
        params: '?status=todo&priority=high&limit=20',
        response: `{ "success": true, "data": { "tasks": [...], "total": 10 } }`,
      },
      {
        method: 'POST', path: '/api/tasks', description: 'Create a new task.',
        tier: 'both',
        body: `{
  "title": "Build the app",
  "description": "Full stack Next.js app",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-04-01",
  "tags": ["dev"]
}`,
        response: `{ "success": true, "data": { "id": "xyz789", "title": "Build the app", ... } }`,
      },
    ],
  },
  {
    section: 'Flashcards',
    endpoints: [
      {
        method: 'GET', path: '/api/flashcards', description: 'List flashcards. Filter by deck.',
        tier: 'both',
        params: '?deck=Biology&limit=50',
        response: `{ "success": true, "data": { "cards": [...], "decks": ["Biology", "Math"] } }`,
      },
      {
        method: 'POST', path: '/api/flashcards', description: 'Create a new flashcard.',
        tier: 'both',
        body: `{
  "front": "What is mitosis?",
  "back": "Cell division producing two identical daughter cells",
  "deck": "Biology",
  "difficulty": "medium"
}`,
        response: `{ "success": true, "data": { "id": "card123", ... } }`,
      },
    ],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-500/15 text-green-400 border-green-500/30',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUT: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card mb-2">
      <button className="w-full flex items-center gap-3 text-left" onClick={() => setOpen(o => !o)}>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded border font-mono flex-shrink-0', METHOD_COLORS[endpoint.method])}>
          {endpoint.method}
        </span>
        <code className="text-sm text-white/80 font-mono flex-1">{endpoint.path}</code>
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0',
          endpoint.tier === 'both' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
          endpoint.tier === 'api' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
          'bg-green-500/10 text-green-400 border-green-500/20'
        )}>
          {endpoint.tier === 'both' ? 'Free + API' : endpoint.tier}
        </span>
        {open ? <ChevronDown size={14} className="text-white/30 flex-shrink-0" /> : <ChevronRight size={14} className="text-white/30 flex-shrink-0" />}
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-white/08 space-y-3 animate-fade-in">
          <p className="text-sm text-white/60">{endpoint.description}</p>
          {endpoint.params && (
            <div>
              <p className="text-xs text-white/40 mb-1">Query Parameters</p>
              <code className="text-xs text-cyan-400 bg-black/30 px-2 py-1 rounded block">{endpoint.params}</code>
            </div>
          )}
          {endpoint.body && (
            <div>
              <p className="text-xs text-white/40 mb-1">Request Body</p>
              <div className="relative">
                <pre className="code-block text-xs">{endpoint.body}</pre>
                <button onClick={() => copy(endpoint.body!)} className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors">
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          )}
          <div>
            <p className="text-xs text-white/40 mb-1">Response</p>
            <pre className="code-block text-xs text-green-400/80">{endpoint.response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const [copiedCurl, setCopiedCurl] = useState(false);

  const curlExample = `curl https://your-app.vercel.app/api/notes \\
  -H "X-API-Key: epic_your_key_here"`;

  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="text-teal-400" size={24} /> API Documentation
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Full REST API for programmatic access to all features</p>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <Globe size={20} className="text-teal-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">Base URL</p>
            <code className="text-xs text-white/40 font-mono">your-app.vercel.app</code>
          </div>
          <div className="card text-center">
            <Shield size={20} className="text-green-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">Free Tier</p>
            <p className="text-xs text-white/40">20 req/hour · No key needed</p>
          </div>
          <div className="card text-center">
            <Zap size={20} className="text-cyan-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">API Tier</p>
            <p className="text-xs text-white/40">1,000 req/hour · X-API-Key header</p>
          </div>
        </div>

        {/* Auth */}
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Code2 size={16} className="text-cyan-400" /> Authentication
          </h2>
          <p className="text-sm text-white/60 mb-3">
            All endpoints work without authentication (free tier). Add your API key for higher rate limits:
          </p>
          <div className="relative">
            <pre className="code-block text-xs">{curlExample}</pre>
            <button
              onClick={() => { navigator.clipboard.writeText(curlExample); setCopiedCurl(true); setTimeout(() => setCopiedCurl(false), 2000); }}
              className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
            >
              {copiedCurl ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/05 border border-yellow-500/15">
            <p className="text-xs text-yellow-400/80">
              <strong>Rate Limit Headers:</strong> Every response includes <code className="bg-black/30 px-1 rounded">X-RateLimit-Limit</code>, <code className="bg-black/30 px-1 rounded">X-RateLimit-Remaining</code>, and <code className="bg-black/30 px-1 rounded">X-Tier</code> headers.
            </p>
          </div>
        </div>

        {/* Endpoints */}
        {ENDPOINTS.map(({ section, endpoints }) => (
          <div key={section} className="mb-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">{section}</h2>
            {endpoints.map((ep, i) => <EndpointCard key={i} endpoint={ep} />)}
          </div>
        ))}

        {/* Error codes */}
        <div className="card mt-6">
          <h2 className="text-sm font-semibold text-white mb-3">Error Codes</h2>
          <div className="space-y-2">
            {[
              { code: '200', desc: 'Success' },
              { code: '400', desc: 'Bad Request — missing or invalid parameters' },
              { code: '429', desc: 'Rate Limit Exceeded — slow down or add API key' },
              { code: '500', desc: 'Internal Server Error' },
            ].map(({ code, desc }) => (
              <div key={code} className="flex items-center gap-3 text-sm">
                <code className={cn('font-mono text-xs px-2 py-0.5 rounded border',
                  code === '200' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                  code === '429' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                  'text-red-400 bg-red-500/10 border-red-500/20'
                )}>{code}</code>
                <span className="text-white/50">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
