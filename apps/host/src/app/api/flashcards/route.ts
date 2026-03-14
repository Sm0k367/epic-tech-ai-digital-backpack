export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getApiContext, rateLimitResponse, apiResponse, errorResponse } from '@/lib/api-middleware';

const cardsStore: Map<string, Record<string, unknown>> = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export async function GET(req: NextRequest) {
  const ctx = getApiContext(req);
  const limited = rateLimitResponse(ctx);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const deck = searchParams.get('deck') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

  let cards = Array.from(cardsStore.values());
  if (deck) cards = cards.filter((c: Record<string, unknown>) => c.deck === deck);

  const decks = [...new Set(Array.from(cardsStore.values()).map((c: Record<string, unknown>) => c.deck as string).filter(Boolean))];

  return apiResponse({ cards: cards.slice(0, limit), total: cards.length, decks }, ctx);
}

export async function POST(req: NextRequest) {
  const ctx = getApiContext(req);
  const limited = rateLimitResponse(ctx);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { front, back, deck = '', difficulty = 'medium' } = body;

    if (!front?.trim() || !back?.trim()) return errorResponse('front and back are required');

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) return errorResponse('difficulty must be: easy, medium, hard');

    const now = new Date().toISOString();
    const card = {
      id: generateId(),
      front: String(front).trim(),
      back: String(back).trim(),
      deck: String(deck),
      difficulty,
      nextReview: now,
      reviewCount: 0,
      createdAt: now,
    };

    cardsStore.set(card.id, card);
    return apiResponse(card, ctx, 201);
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
