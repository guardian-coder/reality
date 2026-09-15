import { getChatGPTUser } from '@/app/chatgpt-auth';
import { evaluateAndStoreClaim, loadRealityData, workspaceForOwner, workspaceForToken } from '@/lib/economic-store';

async function resolveWorkspace(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (token) return workspaceForToken(token);
  const user = await getChatGPTUser();
  return user ? workspaceForOwner(user.userId) : null;
}

export async function GET(request: Request) {
  const workspace = await resolveWorkspace(request);
  if (!workspace) return Response.json({ error: 'A Reality workspace is required' }, { status: 401 });
  return Response.json(await loadRealityData(workspace.id));
}

export async function POST(request: Request) {
  try {
    const workspace = await resolveWorkspace(request);
    if (!workspace) return Response.json({ error: 'A Reality workspace is required' }, { status: 401 });
    return Response.json(await evaluateAndStoreClaim(workspace.id, await request.json()), { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Invalid claim' }, { status: 400 });
  }
}
