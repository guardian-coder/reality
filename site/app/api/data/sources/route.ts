import { getChatGPTUser } from '@/app/chatgpt-auth';
import { createRealitySource, realitySourcesForWorkspace, workspaceForOwner } from '@/lib/economic-store';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const workspace = await workspaceForOwner(user.userId);
  if (!workspace) return Response.json({ error: 'Create a Reality workspace first' }, { status: 409 });
  return Response.json({ sources: await realitySourcesForWorkspace(workspace.id) });
}

export async function POST(request: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
    const workspace = await workspaceForOwner(user.userId);
    if (!workspace) return Response.json({ error: 'Create a Reality workspace first' }, { status: 409 });
    const result = await createRealitySource(workspace.id, await request.json());
    return Response.json({
      source: { ...result.source, tokenHash: undefined },
      token: result.token,
      endpoint: '/api/data/ingest',
    }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Source could not be created' }, { status: 400 });
  }
}
