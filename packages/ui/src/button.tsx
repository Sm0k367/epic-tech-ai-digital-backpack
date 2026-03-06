import { type ReactNode } from 'react';

export function Button({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
    >
      {children}
    </button>
  );
}
