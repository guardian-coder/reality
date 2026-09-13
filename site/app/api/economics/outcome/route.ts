import { ingestOutcome, workspaceForToken } from '@/lib/economic-store';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    const workspace = token ? await workspaceForToken(token) : null;
    if (!workspace) return Response.json({ error: 'Invalid integration token' }, { status: 401 });
    return Response.json(await ingestOutcome(workspace.id, await request.json()), { status: 202 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 }); }
}
