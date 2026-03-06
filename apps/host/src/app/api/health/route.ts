export const runtime = 'edge';

export function GET() {
  return Response.json({ status: 'alive', ts: Date.now() });
}
