export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getApiContext } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const ctx = getApiContext(req);
  return NextResponse.json({
    success: true,
    data: {
      tier: ctx.tier,
      rateLimit: ctx.rateLimit,
      features: {
        notes: true,
        tasks: true,
        flashcards: true,
        chat: true,
        codeSnippets: true,
      },
      apiVersion: '2.0.0',
    },
    tier: ctx.tier,
  }, {
    headers: {
      'X-RateLimit-Limit': String(ctx.rateLimit.limit),
      'X-RateLimit-Remaining': String(ctx.rateLimit.remaining),
      'X-Tier': ctx.tier,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization' } });
}
