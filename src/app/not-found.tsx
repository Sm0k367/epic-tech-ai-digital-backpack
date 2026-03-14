import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <AppShell>
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <AlertTriangle size={48} className="text-yellow-400" />
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">404</h1>
          <p className="text-xl text-white/60 mb-1">Page not found</p>
          <p className="text-sm text-white/30">The page you are looking for does not exist.</p>
        </div>
        <Link href="/" className="btn-primary flex items-center gap-2">
          <Home size={16} /> Back to Dashboard
        </Link>
      </div>
    </AppShell>
  );
}
