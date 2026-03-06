export const runtime = 'edge';

export function GET() {
  return new Response('User-agent: *\nAllow: /', {
    headers: { 'Content-Type': 'text/plain' },
  });
}
