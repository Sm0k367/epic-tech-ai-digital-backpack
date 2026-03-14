export function GET() {
  return Response.json({ 
    status: 'alive', 
    ts: Date.now(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
}
