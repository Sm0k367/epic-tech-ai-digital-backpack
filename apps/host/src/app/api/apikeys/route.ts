export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getApiContext, apiResponse, errorResponse } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const ctx = getApiContext(req);
  return apiResponse({
    tier: ctx.tier,
    rateLimit: ctx.rateLimit,
    message: ctx.tier === 'api'
      ? 'Valid API key — you have full access'
      : 'No API key detected — using free tier (20 req/hour)',
    howToUpgrade: 'Visit /api-keys in the app to generate your free API key',
  }, ctx);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    },
  });
}
