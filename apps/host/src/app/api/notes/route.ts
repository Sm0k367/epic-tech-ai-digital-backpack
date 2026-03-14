import { NextRequest } from 'next/server';
import { getApiContext, rateLimitResponse, apiResponse, errorResponse } from '@/lib/api-middleware';

// In-memory store for API-created notes (resets on cold start)
// In production, use a database like Supabase, PlanetScale, etc.
const notesStore: Map<string, Record<string, unknown>> = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export async function GET(req: NextRequest) {
  const ctx = getApiContext(req);
  const limited = rateLimitResponse(ctx);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');

  let notes = Array.from(notesStore.values());

  if (search) {
    notes = notes.filter((n: Record<string, unknown>) =>
      String(n.title || '').toLowerCase().includes(search.toLowerCase()) ||
      String(n.content || '').toLowerCase().includes(search.toLowerCase())
    );
  }

  if (tag) {
    notes = notes.filter((n: Record<string, unknown>) =>
      Array.isArray(n.tags) && (n.tags as string[]).includes(tag)
    );
  }

  const total = notes.length;
  const paginated = notes.slice(offset, offset + limit);

  return apiResponse({ notes: paginated, total, limit, offset }, ctx);
}

export async function POST(req: NextRequest) {
  const ctx = getApiContext(req);
  const limited = rateLimitResponse(ctx);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { title, content = '', tags = [], color = 'default', pinned = false } = body;

    if (!title?.trim()) return errorResponse('title is required');

    const now = new Date().toISOString();
    const note = {
      id: generateId(),
      title: String(title).trim(),
      content: String(content),
      tags: Array.isArray(tags) ? tags : [],
      color: String(color),
      pinned: Boolean(pinned),
      createdAt: now,
      updatedAt: now,
    };

    notesStore.set(note.id, note);
    return apiResponse(note, ctx, 201);
  } catch {
    return errorResponse('Invalid request body');
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    },
  });
}
