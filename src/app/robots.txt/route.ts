export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://epic-tech-ai-digital-backpack.vercel.app';
  return new NextResponse(
    `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
