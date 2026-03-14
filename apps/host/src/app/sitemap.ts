import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://epic-tech-ai-digital-backpack.vercel.app';
  const routes = ['', '/notes', '/tasks', '/flashcards', '/chat-nexus', '/code-vault', '/music-vault', '/game-labs', '/api-docs', '/api-keys'];
  return routes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
