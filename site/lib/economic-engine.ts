export const ECONOMIC_POLICY_VERSION = 'reality.outcome-policy.v1' as const;

export type EvidenceState = 'VERIFIED' | 'UNVERIFIED' | 'CONTRADICTED';

export type SuccessCriterion = {
  id: string;
  label: string;
};

export type EconomicTaskContract = {
  taskId: string;
  objective: string;
  budgetUsd: number;
  estimatedValueUsd: number;
  successCriteria: SuccessCriterion[];
};

export type ResourceEvent = {
  id: string;
  category: 'MODEL' | 'TOOL' | 'API';
  label: string;
  costUsd: number;
};

export type OutcomeEvidence = {
  id: string;
  criterionId: string;
  label: string;
  source: string;
  state: EvidenceState;
};

export type EconomicDisposition = 'ACCEPTED' | 'NOT ACCEPTED' | 'STOPPED';

export type EconomicRecord = {
  recordVersion: 'reality.economic-record.v1';
  taskId: string;
  runId: string;
  policyVersion: typeof ECONOMIC_POLICY_VERSION;
  disposition: EconomicDisposition;
  reasonCodes: string[];
  budgetUsd: number;
  actualCostUsd: number;
  remainingBudgetUsd: number;
  acceptedValueUsd: number;
  valueCostRatio: number | null;
  criterionResults: Array<SuccessCriterion & { state: EvidenceState; evidenceIds: string[] }>;
  resources: ResourceEvent[];
  evidence: OutcomeEvidence[];
  limitations: string[];
};

const money = (value: number) => Math.round((value + Number.EPSILON) * 10000) / 10000;

export function evaluateResourceAuthorization(input: { budgetMicros: number; spentMicros: number; reservedMicros: number; proposedMicros: number }) {
  const projectedMicros = input.spentMicros + input.reservedMicros + input.proposedMicros;
  const permitted = projectedMicros <= input.budgetMicros;
  return {
    disposition: permitted ? 'PERMIT' as const : 'REFUSE' as const,
    reasonCode: permitted ? 'WITHIN_RESOURCE_ENVELOPE' as const : 'RESOURCE_ENVELOPE_EXCEEDED' as const,
    remainingMicros: Math.max(0, input.budgetMicros - projectedMicros),
  };
}

export function evaluateEconomicOutcome(
  contract: EconomicTaskContract,
  resources: ResourceEvent[],
  evidence: OutcomeEvidence[],
  runId = 'unspecified',
): EconomicRecord {
  const actualCostUsd = money(resources.reduce((sum, event) => sum + event.costUsd, 0));
  const overBudget = actualCostUsd > contract.budgetUsd;

  const criterionResults = contract.successCriteria.map((criterion) => {
    const matches = evidence.filter((item) => item.criterionId === criterion.id);
    const state: EvidenceState = matches.some((item) => item.state === 'CONTRADICTED')
      ? 'CONTRADICTED'
      : matches.some((item) => item.state === 'VERIFIED')
        ? 'VERIFIED'
        : 'UNVERIFIED';

    return { ...criterion, state, evidenceIds: matches.map((item) => item.id) };
  });

  const contradicted = criterionResults.some((criterion) => criterion.state === 'CONTRADICTED');
  const incomplete = criterionResults.some((criterion) => criterion.state === 'UNVERIFIED');
  const disposition: EconomicDisposition = overBudget
    ? 'STOPPED'
    : contradicted || incomplete
      ? 'NOT ACCEPTED'
      : 'ACCEPTED';

  const reasonCodes = [
    ...(overBudget ? ['RESOURCE_ENVELOPE_EXCEEDED'] : []),
    ...(contradicted ? ['OUTCOME_EVIDENCE_CONTRADICTED'] : []),
    ...(incomplete ? ['REQUIRED_OUTCOME_UNVERIFIED'] : []),
    ...(!overBudget && !contradicted && !incomplete ? ['VERIFIED_ACCEPTED_OUTCOME'] : []),
  ];
  const acceptedValueUsd = disposition === 'ACCEPTED' ? contract.estimatedValueUsd : 0;

  return {
    recordVersion: 'reality.economic-record.v1',
    taskId: contract.taskId,
    runId,
    policyVersion: ECONOMIC_POLICY_VERSION,
    disposition,
    reasonCodes,
    budgetUsd: money(contract.budgetUsd),
    actualCostUsd,
    remainingBudgetUsd: money(Math.max(0, contract.budgetUsd - actualCostUsd)),
    acceptedValueUsd: money(acceptedValueUsd),
    valueCostRatio: disposition === 'ACCEPTED' && actualCostUsd > 0
      ? money(acceptedValueUsd / actualCostUsd)
      : null,
    criterionResults,
    resources,
    evidence,
    limitations: [
      'Estimated outcome value is supplied by the task contract and is not independently verified.',
      'Evidence source identity and authenticity are not yet cryptographically verified.',
    ],
  };
}
