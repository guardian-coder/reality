import { authorizeAction, workspaceForToken } from '@/lib/economic-store';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    const workspace = token ? await workspaceForToken(token) : null;
    if (!workspace) return Response.json({ error: 'Invalid integration token' }, { status: 401 });
    const result = await authorizeAction(workspace.id, await request.json());
    return Response.json(result, { status: result.disposition === 'PERMIT' ? 200 : 409 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 });
  }
}
