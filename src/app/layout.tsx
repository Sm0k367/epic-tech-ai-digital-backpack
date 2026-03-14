import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Epic Tech AI — Digital Backpack',
  description: 'Your all-in-one AI-powered productivity suite. Notes, tasks, flashcards, code snippets, AI chat, and music — all in one place. Free tier + API access.',
  keywords: ['AI', 'productivity', 'notes', 'tasks', 'flashcards', 'code', 'digital backpack'],
  authors: [{ name: 'Epic Tech AI' }],
  openGraph: {
    title: 'Epic Tech AI — Digital Backpack',
    description: 'Your all-in-one AI-powered productivity suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epic Tech AI — Digital Backpack',
    description: 'Your all-in-one AI-powered productivity suite',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
