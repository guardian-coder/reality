import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { authorizations, events, realityClaims, realityEvidence, records, runs, tasks, workspaces } from '@/db/schema';
import { ECONOMIC_POLICY_VERSION, evaluateEconomicOutcome, evaluateResourceAuthorization, type EconomicTaskContract, type OutcomeEvidence, type ResourceEvent } from '@/lib/economic-engine';
import { evaluateClaim, type RealityEvidenceInput } from '@/lib/evidence-engine';

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

export async function rotateWorkspaceToken(ownerId: string) {
  const db = getDb();
  const workspace = (await db.select().from(workspaces).where(eq(workspaces.ownerId, ownerId)).limit(1))[0];
  if (!workspace) throw new Error('Create an integration workspace first');
  const token = `reality_live_${crypto.randomUUID().replaceAll('-', '')}`;
  const updated = { ...workspace, tokenHash: await hashToken(token), tokenPrefix: `${token.slice(0, 17)}…` };
  await db.update(workspaces).set({ tokenHash: updated.tokenHash, tokenPrefix: updated.tokenPrefix }).where(eq(workspaces.id, workspace.id));
  return { workspace: updated, token };
}

export async function workspaceForOwner(ownerId: string) {
  return (await getDb().select().from(workspaces).where(eq(workspaces.ownerId, ownerId)).limit(1))[0] ?? null;
}

export async function workspaceForToken(token: string) {
  return (await getDb().select().from(workspaces).where(eq(workspaces.tokenHash, await hashToken(token))).limit(1))[0] ?? null;
}

export async function evaluateAndStoreClaim(workspaceId: string, payload: any) {
  if (!payload?.claim?.id || !payload?.claim?.subject || !payload?.claim?.assertion || !Array.isArray(payload?.evidence)) {
    throw new Error('claim.id, claim.subject, claim.assertion, and evidence are required');
  }
  const db = getDb();
  const stamp = now();
  const externalId = String(payload.claim.id);
  const normalizedEvidence: RealityEvidenceInput[] = payload.evidence.map((item: any) => ({
    id: String(item.id || id('evidence')),
    sourceName: String(item.sourceName || ''),
    sourceRef: String(item.sourceRef || ''),
    relation: item.relation === 'CONTRADICTS' ? 'CONTRADICTS' : 'SUPPORTS',
    lineageId: String(item.lineageId || ''),
    observedAt: String(item.observedAt || ''),
    validUntil: item.validUntil ? String(item.validUntil) : undefined,
    integrityStatus: item.integrityStatus === 'DOCUMENTED' ? 'DOCUMENTED' : 'UNVERIFIED',
  }));
  const evaluation = evaluateClaim(normalizedEvidence);
  const current = (await db.select().from(realityClaims).where(and(eq(realityClaims.workspaceId, workspaceId), eq(realityClaims.externalId, externalId))).limit(1))[0];
  const claim = {
    id: current?.id ?? id('claim'), workspaceId, externalId,
    subject: String(payload.claim.subject), assertion: String(payload.claim.assertion), state: evaluation.state,
    reasonCodesJson: JSON.stringify(evaluation.reasonCodes), evaluatedAt: evaluation.evaluatedAt,
    validUntil: evaluation.validUntil, createdAt: current?.createdAt ?? stamp, updatedAt: stamp,
  };
  if (current) await db.update(realityClaims).set(claim).where(eq(realityClaims.id, current.id));
  else await db.insert(realityClaims).values(claim);
  const evidenceRows = normalizedEvidence.map((item) => ({
    id: item.id!, workspaceId, claimExternalId: externalId, sourceName: item.sourceName!, sourceRef: item.sourceRef!,
    relation: item.relation!, lineageId: item.lineageId!, observedAt: item.observedAt!, validUntil: item.validUntil ?? null,
    integrityStatus: item.integrityStatus!, rawJson: JSON.stringify(item), createdAt: stamp,
  }));
  if (evidenceRows.length) await db.batch(evidenceRows.map((row) => db.insert(realityEvidence).values(row).onConflictDoNothing({ target: realityEvidence.id })) as any);
  return { claim: { ...claim, reasonCodes: evaluation.reasonCodes, independentLineages: evaluation.independentLineages }, evidence: evidenceRows };
}

export async function loadRealityData(workspaceId: string) {
  return {
    claims: await getDb().select().from(realityClaims).where(eq(realityClaims.workspaceId, workspaceId)).orderBy(desc(realityClaims.updatedAt)).limit(50),
    evidence: await getDb().select().from(realityEvidence).where(eq(realityEvidence.workspaceId, workspaceId)).orderBy(desc(realityEvidence.createdAt)).limit(100),
  };
}

async function upsertTask(workspaceId: string, task: any) {
  if (!task?.id || !task?.objective || !Array.isArray(task?.successCriteria)) throw new Error('task.id, task.objective, and task.successCriteria are required');
  if (!Number.isFinite(Number(task.budgetUsd)) || Number(task.budgetUsd) < 0) throw new Error('task.budgetUsd must be a non-negative number');
  const db = getDb();
  const stamp = now();
  const current = await db.select().from(tasks).where(and(eq(tasks.workspaceId, workspaceId), eq(tasks.externalId, String(task.id)))).limit(1);
  const row = { id: current[0]?.id ?? id('task'), workspaceId, externalId: String(task.id), objective: String(task.objective), budgetMicros: moneyMicros(task.budgetUsd), estimatedValueMicros: moneyMicros(task.estimatedValueUsd), criteriaJson: JSON.stringify(task.successCriteria), createdAt: current[0]?.createdAt ?? stamp, updatedAt: stamp };
  if (current[0]) await db.update(tasks).set(row).where(eq(tasks.id, current[0].id)); else await db.insert(tasks).values(row);
  return row;
}

function normalizedContract(task: any): EconomicTaskContract {
  return { taskId: String(task.id), objective: String(task.objective), budgetUsd: Number(task.budgetUsd), estimatedValueUsd: Number(task.estimatedValueUsd || 0), successCriteria: task.successCriteria.map((criterion: any) => ({ id: String(criterion.id), label: String(criterion.label) })) };
}

async function freezeRun(workspaceId: string, task: any, runId: string) {
  const db = getDb();
  const contract = normalizedContract(task);
  const contractJson = JSON.stringify(contract);
  const existing = (await db.select().from(runs).where(and(eq(runs.workspaceId, workspaceId), eq(runs.taskExternalId, contract.taskId), eq(runs.runId, runId))).limit(1))[0];
  if (existing && existing.contractJson !== contractJson) throw new Error('The task contract is frozen for this run and cannot be changed');
  if (existing) return existing;
  const row = { id: id('run'), workspaceId, taskExternalId: contract.taskId, runId, contractJson, budgetMicros: moneyMicros(contract.budgetUsd), estimatedValueMicros: moneyMicros(contract.estimatedValueUsd), policyVersion: ECONOMIC_POLICY_VERSION, createdAt: now() };
  await db.insert(runs).values(row);
  return row;
}

export async function authorizeAction(workspaceId: string, payload: any) {
  if (!payload?.runId || !payload?.action?.id || !payload?.action?.label) throw new Error('runId, action.id, and action.label are required');
  if (!Number.isFinite(Number(payload.action.estimatedCostUsd)) || Number(payload.action.estimatedCostUsd) < 0) throw new Error('action.estimatedCostUsd must be a non-negative number');
  const run = await freezeRun(workspaceId, payload.task, String(payload.runId));
  const task = await upsertTask(workspaceId, payload.task);
  const proposedMicros = moneyMicros(payload.action.estimatedCostUsd);
  const db = getDb();
  const spent = (await db.select().from(events).where(and(eq(events.workspaceId, workspaceId), eq(events.taskExternalId, task.externalId), eq(events.runId, String(payload.runId))))).filter((event) => event.eventType === 'EXECUTION').reduce((sum, event) => sum + event.costMicros, 0);
  const existing = await db.select().from(authorizations).where(and(eq(authorizations.workspaceId, workspaceId), eq(authorizations.taskExternalId, task.externalId), eq(authorizations.runId, String(payload.runId)), eq(authorizations.actionExternalId, String(payload.action.id)))).limit(1);
  const reserved = (await db.select().from(authorizations).where(and(eq(authorizations.workspaceId, workspaceId), eq(authorizations.taskExternalId, task.externalId), eq(authorizations.runId, String(payload.runId))))).filter((item) => item.disposition === 'PERMIT' && !item.consumedAt && item.id !== existing[0]?.id).reduce((sum, item) => sum + item.estimatedCostMicros, 0);
  const evaluation = evaluateResourceAuthorization({ budgetMicros: run.budgetMicros, spentMicros: spent, reservedMicros: reserved, proposedMicros });
  const decision = existing[0] ?? { id: id('auth'), workspaceId, taskExternalId: task.externalId, runId: String(payload.runId), actionExternalId: String(payload.action.id), category: String(payload.action.category || 'OTHER'), label: String(payload.action.label), estimatedCostMicros: proposedMicros, disposition: evaluation.disposition, reasonCode: evaluation.reasonCode, policyVersion: ECONOMIC_POLICY_VERSION, createdAt: now(), consumedAt: null };
  if (!existing[0]) await db.insert(authorizations).values(decision);
  const decisionReservation = decision.disposition === 'PERMIT' && !decision.consumedAt ? decision.estimatedCostMicros : 0;
  return { authorizationId: decision.id, disposition: decision.disposition, reasonCode: decision.reasonCode, policyVersion: decision.policyVersion, remainingBudgetUsd: Math.max(0, run.budgetMicros - spent - reserved - decisionReservation) / 1_000_000 };
}

export async function ingestExecution(workspaceId: string, payload: any) {
  const db = getDb();
  const task = payload.task ?? {};
  if (!task.id || !task.objective || !Array.isArray(task.successCriteria) || !payload.runId || !Array.isArray(payload.events)) throw new Error('task.id, task.objective, task.successCriteria, runId, and events are required');
  const run = (await db.select().from(runs).where(and(eq(runs.workspaceId, workspaceId), eq(runs.taskExternalId, String(task.id)), eq(runs.runId, String(payload.runId)))).limit(1))[0];
  if (!run) throw new Error('Authorize an action before sending execution events');
  const stamp = now();
  const operations = [];
  for (const event of payload.events) {
    if (!event.authorizationId) throw new Error(`authorizationId is required for execution event ${event.id || '(missing id)'}`);
    if (!event.actionId) throw new Error(`actionId is required for execution event ${event.id || '(missing id)'}`);
    if (!Number.isFinite(Number(event.costUsd)) || Number(event.costUsd) < 0) throw new Error(`costUsd must be a non-negative number for execution event ${event.id || '(missing id)'}`);
    const authorization = (await db.select().from(authorizations).where(and(eq(authorizations.id, String(event.authorizationId)), eq(authorizations.workspaceId, workspaceId), eq(authorizations.taskExternalId, String(task.id)), eq(authorizations.runId, String(payload.runId)))).limit(1))[0];
    if (!authorization || authorization.disposition !== 'PERMIT') throw new Error(`execution event ${event.id || '(missing id)'} has no valid permit`);
    if (authorization.actionExternalId !== String(event.actionId)) throw new Error(`authorization ${authorization.id} does not belong to action ${event.actionId}`);
    if (authorization.category !== String(event.category || 'OTHER') || authorization.label !== String(event.label || 'Agent operation')) throw new Error(`execution event ${event.id || '(missing id)'} does not match its authorized action`);
    if (authorization.consumedAt) throw new Error(`authorization ${authorization.id} has already been consumed`);
    if (moneyMicros(event.costUsd) > authorization.estimatedCostMicros) throw new Error(`execution event ${event.id || '(missing id)'} exceeds its authorized cost`);
    operations.push(db.insert(events).values({ id: String(event.id || id('evt')), workspaceId, taskExternalId: String(task.id), runId: String(payload.runId), eventType: 'EXECUTION', category: String(event.category || 'OTHER'), label: String(event.label || 'Agent operation'), costMicros: moneyMicros(event.costUsd), occurredAt: String(event.occurredAt || stamp), receivedAt: stamp, rawJson: JSON.stringify(event) }).onConflictDoNothing({ target: events.id }));
    operations.push(db.update(authorizations).set({ consumedAt: stamp }).where(eq(authorizations.id, authorization.id)));
  }
  if (operations.length) await db.batch(operations as any);
  return { accepted: payload.events.length, taskId: task.id, runId: payload.runId };
}

export async function ingestOutcome(workspaceId: string, payload: any) {
  if (!payload.taskId || !payload.runId || !Array.isArray(payload.evidence)) throw new Error('taskId, runId, and evidence are required');
  const stamp = now();
  const db = getDb();
  const verifiedItems = [];
  for (const item of payload.evidence) {
    const claimId = String(item.claimId || '');
    const claim = claimId ? (await db.select().from(realityClaims).where(and(eq(realityClaims.workspaceId, workspaceId), eq(realityClaims.externalId, claimId))).limit(1))[0] : null;
    const fresh = claim?.validUntil ? new Date(claim.validUntil).getTime() > Date.now() : false;
    const state = claim && fresh
      ? claim.state === 'CONFIRMED' ? 'VERIFIED' : claim.state === 'CONTRADICTED' ? 'CONTRADICTED' : 'UNVERIFIED'
      : 'UNVERIFIED';
    verifiedItems.push({ ...item, state, source: claim ? `Reality claim ${claim.externalId}` : 'No verified Reality claim' });
  }
  const inserts = verifiedItems.map((item: any) => db.insert(events).values({ id: String(item.id || id('ev')), workspaceId, taskExternalId: String(payload.taskId), runId: String(payload.runId), eventType: 'OUTCOME', label: String(item.label || 'Outcome evidence'), criterionId: String(item.criterionId || ''), evidenceState: item.state, source: item.source, occurredAt: String(item.occurredAt || stamp), receivedAt: stamp, rawJson: JSON.stringify(item) }).onConflictDoNothing({ target: events.id }));
  if (inserts.length) await db.batch(inserts as any);
  const run = (await db.select().from(runs).where(and(eq(runs.workspaceId, workspaceId), eq(runs.taskExternalId, String(payload.taskId)), eq(runs.runId, String(payload.runId)))).limit(1))[0];
  if (!run) throw new Error('Frozen run contract was not found');
  const runEvents = await db.select().from(events).where(and(eq(events.workspaceId, workspaceId), eq(events.taskExternalId, String(payload.taskId)), eq(events.runId, String(payload.runId))));
  const contract = JSON.parse(run.contractJson) as EconomicTaskContract;
  const resources: ResourceEvent[] = runEvents.filter((event) => event.eventType === 'EXECUTION').map((event) => ({ id: event.id, category: event.category as ResourceEvent['category'], label: event.label, costUsd: event.costMicros / 1_000_000 }));
  const outcomeEvidence: OutcomeEvidence[] = runEvents.filter((event) => event.eventType === 'OUTCOME').map((event) => ({ id: event.id, criterionId: event.criterionId || '', label: event.label, source: event.source || 'External system', state: event.evidenceState as OutcomeEvidence['state'] }));
  const economicRecord = evaluateEconomicOutcome(contract, resources, outcomeEvidence, String(payload.runId));
  const current = await db.select().from(records).where(and(eq(records.workspaceId, workspaceId), eq(records.taskExternalId, contract.taskId), eq(records.runId, String(payload.runId)))).limit(1);
  const recordRow = { id: current[0]?.id ?? id('record'), workspaceId, taskExternalId: contract.taskId, runId: String(payload.runId), disposition: economicRecord.disposition, actualCostMicros: moneyMicros(economicRecord.actualCostUsd), acceptedValueMicros: moneyMicros(economicRecord.acceptedValueUsd), policyVersion: economicRecord.policyVersion, recordJson: JSON.stringify(economicRecord), createdAt: current[0]?.createdAt ?? stamp, updatedAt: stamp };
  if (current[0]) await db.update(records).set(recordRow).where(eq(records.id, current[0].id)); else await db.insert(records).values(recordRow);
  return { accepted: inserts.length, taskId: payload.taskId, runId: payload.runId, economicRecord };
}

export async function loadOverview(workspaceId: string) {
  const db = getDb();
  return {
    tasks: await db.select().from(tasks).where(eq(tasks.workspaceId, workspaceId)).orderBy(desc(tasks.updatedAt)).limit(20),
    runs: await db.select().from(runs).where(eq(runs.workspaceId, workspaceId)).orderBy(desc(runs.createdAt)).limit(20),
    events: await db.select().from(events).where(eq(events.workspaceId, workspaceId)).orderBy(desc(events.receivedAt)).limit(100),
    authorizations: await db.select().from(authorizations).where(eq(authorizations.workspaceId, workspaceId)).orderBy(desc(authorizations.createdAt)).limit(100),
    records: await db.select().from(records).where(eq(records.workspaceId, workspaceId)).orderBy(desc(records.updatedAt)).limit(20),
  };
}
