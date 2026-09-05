# NIST Outreach — Personalized Draft for Edward R. Griffor

- **Date drafted:** 2026-09-05
- **Status: DRAFT ONLY. NOT SENT.** For Brayan's review before any send decision.
- **Recipient identified:** Edward R. Griffor, National Institute of Standards and Technology (Engineering Laboratory).

## Why this specific person

`outreach/FIRST_INSTITUTION_SHORTLIST.md` names the NIST CPS/IoT program generally. This narrows that to one named researcher whose own published work overlaps the project's specific open question, verified against public sources (no internal directory, no unpublished info):

- Edward R. Griffor is a lead co-author of the NIST CPS Framework itself — **Framework for Cyber-Physical Systems, Volume 1: Overview** (NIST Special Publication 1500-201, with Christopher Greer, David A. Wollman, Martin J. Burns; NIST, June 26, 2017). (https://www.nist.gov/publications/framework-cyber-physical-systems-volume-1-overview)
- Griffor is first author on **"Reasoning about Trustworthiness in Cyber-Physical Systems Using Ontology-Based Representation and ASP"** (with Thanh Nguyen, Matthew Bundas, Son Tran, Marcello Balduccini, Kathleen Garwood; 11th International Conference on Formal Ontology in Information Systems, FOIS 2020; published via NIST, Feb 14, 2021). (https://www.nist.gov/publications/reasoning-about-trustworthiness-cyber-physical-systems-using-ontology-based)
- Griffor is a co-author of **"Specifying and Reasoning about CPS through the Lens of the NIST CPS Framework"** (arXiv:2201.05710, submitted January 14, 2022). Its abstract says the paper formalizes, through Answer Set Programming, dependencies or conflicts between CPS concerns and possible mitigation strategies. (https://arxiv.org/abs/2201.05710)

That third paper is the closest published match to this project's specific finding: it formally represents dependencies between concerns in a CPS and reasons about them computationally. The open question this project has — whether a dependency correctly identified during analysis reliably survives into the operational rules that gate a runtime decision, or whether that step is where it silently drops out — sits directly inside the kind of specification-to-reasoning pipeline that paper builds. This is a substantially better-targeted match than "the CPS/IoT program" in general, and it's built entirely from what these three papers themselves say, not from guessing what NIST's internal organization looks like.

## Boundary respected

No private contact details are used or included here — Griffor's NIST affiliation and the papers above are all from NIST's own public-facing pages or the papers' own published bylines. If Brayan sends this, standard public professional contact channels (NIST staff directory, or the corresponding-author address printed in the TPLP paper itself) would be used, not anything sourced here.

## Draft message

**Subject:** A question about dependency information surviving from specification into runtime rules

Hello Dr. Griffor,

My name is Brayan Lucas Mwangimba. I'm developing an open research project called Reality with AI collaborators, working on a narrow question in autonomous/cyber-physical system assurance, and your published work looks like the closest match I've found for a specific problem we've run into.

We built a small, non-weaponized prototype: a Claim–Evidence–Action contract that asks whether the evidence required for a simulated action is confirmed, contradicted, or still unknown, and whether apparently independent evidence shares a failure dependency.

The most useful result came from testing whether dependency information itself can be produced reliably. We gave two independent reviewers a public FHWA bridge-monitoring report and asked them to identify shared dependencies, then translate their findings into action rules. One reviewer named a shared signal-conditioning dependency in the findings but dropped it from the derived rules. A third reviewer, given only those findings and required to produce a dependency-to-rule coverage table, recovered it.

In our evaluator, including or omitting that rule changes the output under a constructed common-bias model. That is not evidence of a real unsafe bridge decision: the exact hardware pairing and failure effect were not established by the FHWA report. The narrower observed result is that known dependency information was lost during findings-to-rules translation.

Your paper with Nguyen, Bundas, Son, Balduccini, and Garwood, “Specifying and Reasoning about CPS through the Lens of the NIST CPS Framework,” formalizes dependencies between CPS concerns using Answer Set Programming. It appears close to the question we cannot answer: can we verify that every relevant dependency identified during analysis is represented in the rules or checks that govern operation?

I'm not writing to claim we've found something new — this may already be a known, named, and solved problem in CPS assurance practice, and if so I'd genuinely like to know that and be pointed to it. What I'd value most is either: a pointer to whether your ASP-based formalization (or the CPS Framework's trustworthiness/data aspects more broadly) already covers this specification-to-operational-rules gap, or your sense of the smallest experiment that would show our framing is wrong or redundant.

Our work, including this specific falsification result and our failed tests, is public here: https://github.com/guardian-coder/reality

Thank you for your time — I know this is a narrow, unsolicited question, and I appreciate you reading it either way.

Brayan Lucas Mwangimba

---

## Explicit non-claims (per instruction)

- Does not claim the "findings-to-rules" gap is novel or undiscovered — the message explicitly invites Griffor to say it's already solved/named.
- Does not ask for funding, endorsement, or access to any controlled system.
- Does not reference weapon-targeting or autonomous-attack work.
- Does not include any contact information beyond what is already on NIST's own public pages and the cited papers' own published bylines.
