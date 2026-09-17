export type ClaimState = 'CONFIRMED' | 'CONTRADICTED' | 'UNKNOWN';
export type EvidenceRelation = 'SUPPORTS' | 'CONTRADICTS';

export type RealityEvidenceInput = {
  id?: string;
  sourceName?: string;
  sourceRef?: string;
  relation?: EvidenceRelation;
  lineageId?: string;
  observedAt?: string;
  validUntil?: string;
  integrityStatus?: 'DOCUMENTED' | 'UNVERIFIED';
  sourceId?: string;
  sourceCategory?: string;
  ingestionMode?: 'CONTROLLED_TEST' | 'AUTHENTICATED_WEBHOOK' | 'DIRECT';
};

export type ClaimEvaluation = {
  state: ClaimState;
  reasonCodes: string[];
  independentLineages: number;
  validUntil: string | null;
  evaluatedAt: string;
};

export function evaluateClaim(evidence: RealityEvidenceInput[], at = new Date()): ClaimEvaluation {
  const reasons = new Set<string>();
  const valid = evidence.filter((item) => {
    if (!item.sourceName?.trim() || !item.sourceRef?.trim() || !item.lineageId?.trim()) {
      reasons.add('PROVENANCE_INCOMPLETE');
      return false;
    }
    if (item.integrityStatus !== 'DOCUMENTED') {
      reasons.add('SOURCE_INTEGRITY_UNVERIFIED');
      return false;
    }
    const observed = item.observedAt ? new Date(item.observedAt) : null;
    if (!observed || Number.isNaN(observed.getTime()) || observed.getTime() > at.getTime() + 60_000) {
      reasons.add('OBSERVATION_TIME_INVALID');
      return false;
    }
    if (item.validUntil) {
      const expiry = new Date(item.validUntil);
      if (Number.isNaN(expiry.getTime()) || expiry.getTime() <= at.getTime()) {
        reasons.add('EVIDENCE_STALE');
        return false;
      }
    } else {
      reasons.add('FRESHNESS_BOUND_MISSING');
      return false;
    }
    return true;
  });

  const contradictions = valid.filter((item) => item.relation === 'CONTRADICTS');
  const support = valid.filter((item) => item.relation === 'SUPPORTS');
  const lineages = new Set(support.map((item) => item.lineageId));
  let state: ClaimState = 'UNKNOWN';
  if (contradictions.length) {
    state = 'CONTRADICTED';
    reasons.add('CREDIBLE_CONTRADICTION_PRESENT');
  } else if (support.length && lineages.size > 0) {
    state = 'CONFIRMED';
    reasons.add('EVIDENCE_CONTRACT_SATISFIED');
  } else {
    reasons.add('POSITIVE_CONFIRMATION_ABSENT');
  }

  const expiries = valid.map((item) => item.validUntil).filter(Boolean).map((value) => new Date(value!).getTime());
  return {
    state,
    reasonCodes: [...reasons],
    independentLineages: lineages.size,
    validUntil: expiries.length ? new Date(Math.min(...expiries)).toISOString() : null,
    evaluatedAt: at.toISOString(),
  };
}
