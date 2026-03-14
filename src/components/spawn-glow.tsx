'use client';
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpawnGlowProps {
  children: React.ReactNode;
  className?: string;
}

export function SpawnGlow({ children, className }: SpawnGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
