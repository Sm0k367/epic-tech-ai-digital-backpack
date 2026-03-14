import { NextRequest, NextResponse } from 'next/server';

export interface ApiContext {
  tier: 'free' | 'api';
  apiKey?: string;
  rateLimit: {
    limit: number;
    remaining: number;
  };
}

// In-memory rate limiting (resets on cold start — use Redis/KV for production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS = {
  free: { limit: 20, windowMs: 60 * 60 * 1000 }, // 20/hour
  api: { limit: 1000, windowMs: 60 * 60 * 1000 }, // 1000/hour
};

// Valid API keys — in production, store in DB/KV
// For demo: any key starting with "epic_" is valid
function validateApiKey(key: string): boolean {
  if (!key) return false;
  // Accept keys starting with epic_ that are at least 20 chars
  return key.startsWith('epic_') && key.length >= 20;
}

export function checkRateLimit(identifier: string, tier: 'free' | 'api'): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const config = RATE_LIMITS[tier];
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, limit: config.limit, remaining: config.limit - 1, resetAt };
  }

  if (entry.count >= config.limit) {
    return { allowed: false, limit: config.limit, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

export function getApiContext(req: NextRequest): ApiContext {
  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (apiKey && validateApiKey(apiKey)) {
    const rl = checkRateLimit(`api:${apiKey}`, 'api');
    return {
      tier: 'api',
      apiKey,
      rateLimit: { limit: rl.limit, remaining: rl.remaining },
    };
  }

  // Free tier — use IP as identifier
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
  const rl = checkRateLimit(`free:${ip}`, 'free');
  return {
    tier: 'free',
    rateLimit: { limit: rl.limit, remaining: rl.remaining },
  };
}

export function rateLimitResponse(context: ApiContext): NextResponse | null {
  if (context.rateLimit.remaining < 0) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        tier: context.tier,
        limit: context.rateLimit.limit,
        message: context.tier === 'free'
          ? 'Free tier: 20 requests/hour. Add X-API-Key header for 1000 requests/hour.'
          : 'API tier limit reached. Contact support for higher limits.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(context.rateLimit.limit),
          'X-RateLimit-Remaining': '0',
          'X-Tier': context.tier,
        },
      }
    );
  }
  return null;
}

export function apiResponse<T>(data: T, context: ApiContext, status = 200): NextResponse {
  return NextResponse.json(
    { success: true, data, tier: context.tier },
    {
      status,
      headers: {
        'X-RateLimit-Limit': String(context.rateLimit.limit),
        'X-RateLimit-Remaining': String(context.rateLimit.remaining),
        'X-Tier': context.tier,
      },
    }
  );
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}
