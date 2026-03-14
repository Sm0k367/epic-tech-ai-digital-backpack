export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getApiContext, rateLimitResponse, apiResponse, errorResponse } from '@/lib/api-middleware';

const tasksStore: Map<string, Record<string, unknown>> = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export async function GET(req: NextRequest) {
  const ctx = getApiContext(req);
  const limited = rateLimitResponse(ctx);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');

  let tasks = Array.from(tasksStore.values());

  if (status) tasks = tasks.filter((t: Record<string, unknown>) => t.status === status);
  if (priority) tasks = tasks.filter((t: Record<string, unknown>) => t.priority === priority);

  const total = tasks.length;
  const paginated = tasks.slice(offset, offset + limit);

  return apiResponse({ tasks: paginated, total, limit, offset }, ctx);
}

export async function POST(req: NextRequest) {
  const ctx = getApiContext(req);
  const limited = rateLimitResponse(ctx);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { title, description = '', priority = 'medium', status = 'todo', dueDate, tags = [] } = body;

    if (!title?.trim()) return errorResponse('title is required');

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const validStatuses = ['todo', 'in-progress', 'done'];

    if (!validPriorities.includes(priority)) return errorResponse('priority must be: low, medium, high, urgent');
    if (!validStatuses.includes(status)) return errorResponse('status must be: todo, in-progress, done');

    const now = new Date().toISOString();
    const task = {
      id: generateId(),
      title: String(title).trim(),
      description: String(description),
      priority,
      status,
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : [],
      createdAt: now,
      updatedAt: now,
    };

    tasksStore.set(task.id, task);
    return apiResponse(task, ctx, 201);
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
