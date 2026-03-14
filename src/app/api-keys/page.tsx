'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { useToast } from '@/components/ui/Toast';
import { Key, Plus, Copy, Check, Trash2, Eye, EyeOff, Zap, Shield, Globe } from 'lucide-react';
import { getItem, setItem } from '@/lib/storage';
import { generateId, formatDate } from '@/lib/utils';

interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  requestCount: number;
}

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'epic_';
  for (let i = 0; i < 32; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [name, setName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setKeys(getItem<ApiKeyRecord[]>('epic_api_keys', []));
  }, []);

  const saveKeys = (updated: ApiKeyRecord[]) => {
    setKeys(updated);
    setItem('epic_api_keys', updated);
  };

  const createKey = () => {
    if (!name.trim()) { toast('Enter a name for your key', 'error'); return; }
    if (keys.length >= 5) { toast('Max 5 API keys allowed', 'warning'); return; }
    const record: ApiKeyRecord = {
      id: generateId(),
      name: name.trim(),
      key: generateApiKey(),
      createdAt: new Date().toISOString(),
      requestCount: 0,
    };
    saveKeys([record, ...keys]);
    setName('');
    toast('API key created!', 'success');
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast('Key copied to clipboard', 'success');
  };

  const deleteKey = (id: string) => {
    saveKeys(keys.filter(k => k.id !== id));
    toast('Key deleted', 'info');
  };

  const maskKey = (key: string) => key.slice(0, 8) + '••••••••••••••••••••••••' + key.slice(-4);

  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="text-cyan-400" size={24} /> API Keys
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Manage your API keys for programmatic access</p>
        </div>

        {/* Tier info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="card border-white/08">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-white/40" />
              <span className="text-sm font-semibold text-white/70">Free Tier</span>
            </div>
            <p className="text-2xl font-bold text-white">20 <span className="text-sm font-normal text-white/40">req/hour</span></p>
            <p className="text-xs text-white/30 mt-1">No API key required · IP-based rate limiting</p>
          </div>
          <div className="card border-cyan-500/20 bg-cyan-500/05">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">API Tier</span>
            </div>
            <p className="text-2xl font-bold text-white">1,000 <span className="text-sm font-normal text-white/40">req/hour</span></p>
            <p className="text-xs text-white/30 mt-1">Add X-API-Key header · Full feature access</p>
          </div>
        </div>

        {/* Create key */}
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Plus size={16} className="text-cyan-400" /> Create New Key
          </h2>
          <div className="flex gap-3">
            <input
              className="input-field flex-1"
              placeholder="Key name (e.g. My App, Production)"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createKey()}
            />
            <button onClick={createKey} className="btn-primary flex items-center gap-2 flex-shrink-0">
              <Plus size={16} /> Generate
            </button>
          </div>
          <p className="text-xs text-white/30 mt-2 flex items-center gap-1">
            <Shield size={11} /> Keys are stored locally in your browser. Keep them secret.
          </p>
        </div>

        {/* Keys list */}
        {keys.length === 0 ? (
          <div className="text-center py-12">
            <Key size={40} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30">No API keys yet</p>
            <p className="text-white/20 text-sm mt-1">Create your first key above</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white/60">Your Keys ({keys.length}/5)</h2>
            {keys.map(k => (
              <div key={k.id} className="card group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">{k.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-white/50 bg-white/05 px-2 py-1 rounded">
                        {visibleId === k.id ? k.key : maskKey(k.key)}
                      </code>
                      <button onClick={() => setVisibleId(v => v === k.id ? null : k.id)} className="text-white/30 hover:text-white/60 transition-colors">
                        {visibleId === k.id ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-white/25 mt-1">Created {formatDate(k.createdAt)}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => copyKey(k.id, k.key)} className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
                      {copiedId === k.id ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                    </button>
                    <button onClick={() => deleteKey(k.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usage example */}
        <div className="mt-6 card">
          <h2 className="text-sm font-semibold text-white mb-3">Usage Example</h2>
          <pre className="code-block text-xs overflow-x-auto">
{`# Free tier (no key needed)
curl https://your-app.vercel.app/api/notes

# API tier (with key)
curl https://your-app.vercel.app/api/notes \\
  -H "X-API-Key: epic_your_key_here"

# POST example
curl -X POST https://your-app.vercel.app/api/chat \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: epic_your_key_here" \\
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'`}
          </pre>
        </div>
      </div>
    </AppShell>
  );
}
