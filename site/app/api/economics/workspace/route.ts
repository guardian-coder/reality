import { createWorkspace, loadOverview, rotateWorkspaceToken, workspaceForOwner } from '@/lib/economic-store';
import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const workspace = await workspaceForOwner(user.userId);
  if (!workspace) return Response.json({ workspace: null, tasks: [], runs: [], events: [], authorizations: [], records: [] });
  return Response.json({ workspace: { id: workspace.id, name: workspace.name, tokenPrefix: workspace.tokenPrefix }, ...(await loadOverview(workspace.id)) });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const payload = await request.json().catch(() => ({}));
  const result = payload.rotateToken
    ? await rotateWorkspaceToken(user.userId)
    : await createWorkspace(user.userId, String(payload.name || 'My agent operations'));
  return Response.json({ workspace: { id: result.workspace.id, name: result.workspace.name, tokenPrefix: result.workspace.tokenPrefix }, token: result.token }, { status: result.token ? 201 : 200 });
}
