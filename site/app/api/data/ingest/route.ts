import { ingestRealitySourceEvidence, realitySourceForToken } from '@/lib/economic-store';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (!token) return Response.json({ error: 'Source key required' }, { status: 401 });
    const source = await realitySourceForToken(token);
    if (!source) return Response.json({ error: 'Source key is invalid' }, { status: 401 });
    return Response.json(await ingestRealitySourceEvidence(source, await request.json()), { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Evidence event was rejected' }, { status: 400 });
  }
}
