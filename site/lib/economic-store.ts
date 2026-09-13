import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { events, tasks, workspaces } from '@/db/schema';

const now = () => new Date().toISOString();
const moneyMicros = (value: unknown) => Math.max(0, Math.round(Number(value || 0) * 1_000_000));
const id = (prefix: string) => `${prefix}_${crypto.randomUUID().replaceAll('-', '')}`;

export async function hashToken(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createWorkspace(ownerId: string, name: string) {
  const db = getDb();
  const existing = await db.select().from(workspaces).where(eq(workspaces.ownerId, ownerId)).limit(1);
  if (existing[0]) return { workspace: existing[0], token: null };
  const token = `reality_live_${crypto.randomUUID().replaceAll('-', '')}`;
  const workspace = { id: id('ws'), ownerId, name: name.trim() || 'My agent operations', tokenHash: await hashToken(token), tokenPrefix: `${token.slice(0, 17)}…`, createdAt: now() };
  await db.insert(workspaces).values(workspace);
  return { workspace, token };
}

export async function workspaceForOwner(ownerId: string) {
  return (await getDb().select().from(workspaces).where(eq(workspaces.ownerId, ownerId)).limit(1))[0] ?? null;
}

export async function workspaceForToken(token: string) {
  return (await getDb().select().from(workspaces).where(eq(workspaces.tokenHash, await hashToken(token))).limit(1))[0] ?? null;
}

export async function ingestExecution(workspaceId: string, payload: any) {
  const db = getDb();
  const task = payload.task ?? {};
  if (!task.id || !task.objective || !Array.isArray(task.successCriteria) || !payload.runId || !Array.isArray(payload.events)) throw new Error('task.id, task.objective, task.successCriteria, runId, and events are required');
  const stamp = now();
  const current = await db.select().from(tasks).where(and(eq(tasks.workspaceId, workspaceId), eq(tasks.externalId, task.id))).limit(1);
  const row = { id: current[0]?.id ?? id('task'), workspaceId, externalId: String(task.id), objective: String(task.objective), budgetMicros: moneyMicros(task.budgetUsd), estimatedValueMicros: moneyMicros(task.estimatedValueUsd), criteriaJson: JSON.stringify(task.successCriteria), createdAt: current[0]?.createdAt ?? stamp, updatedAt: stamp };
  if (current[0]) await db.update(tasks).set(row).where(eq(tasks.id, current[0].id)); else await db.insert(tasks).values(row);
  const inserts = payload.events.map((event: any) => db.insert(events).values({ id: String(event.id || id('evt')), workspaceId, taskExternalId: String(task.id), runId: String(payload.runId), eventType: 'EXECUTION', category: String(event.category || 'OTHER'), label: String(event.label || 'Agent operation'), costMicros: moneyMicros(event.costUsd), occurredAt: String(event.occurredAt || stamp), receivedAt: stamp, rawJson: JSON.stringify(event) }).onConflictDoNothing({ target: events.id }));
  if (inserts.length) await db.batch(inserts as any);
  return { accepted: inserts.length, taskId: task.id, runId: payload.runId };
}

export async function ingestOutcome(workspaceId: string, payload: any) {
  if (!payload.taskId || !payload.runId || !Array.isArray(payload.evidence)) throw new Error('taskId, runId, and evidence are required');
  const stamp = now();
  const db = getDb();
  const inserts = payload.evidence.map((item: any) => db.insert(events).values({ id: String(item.id || id('ev')), workspaceId, taskExternalId: String(payload.taskId), runId: String(payload.runId), eventType: 'OUTCOME', label: String(item.label || 'Outcome evidence'), criterionId: String(item.criterionId || ''), evidenceState: String(item.state || 'UNVERIFIED'), source: String(item.source || 'External system'), occurredAt: String(item.occurredAt || stamp), receivedAt: stamp, rawJson: JSON.stringify(item) }).onConflictDoNothing({ target: events.id }));
  if (inserts.length) await db.batch(inserts as any);
  return { accepted: inserts.length, taskId: payload.taskId, runId: payload.runId };
}

export async function loadOverview(workspaceId: string) {
  const db = getDb();
  return {
    tasks: await db.select().from(tasks).where(eq(tasks.workspaceId, workspaceId)).orderBy(desc(tasks.updatedAt)).limit(20),
    events: await db.select().from(events).where(eq(events.workspaceId, workspaceId)).orderBy(desc(events.receivedAt)).limit(100),
  };
}
