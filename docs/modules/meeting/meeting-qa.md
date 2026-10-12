# Mimir — Meeting Prep & Adversarial Q&A

> Cheat-sheet for the review of **Mimir** (the Modules intelligence engine). Glance under pressure.
> Audience: Engineers & Architects · ML team · CTO · Chief Strategy Officer · VP Eng · PM.
> **Golden framing:** one engine turns evidence → a verified, costed, risk-scored, auditable
> decision; domain knowledge is a *pack*, never engine code; new category = new pack, zero engine change.

---

## ⚠️ THIN ICE — rehearse these tonight

The honest open risks. Walk in knowing exactly where they are; don't bluff past them.

1. **"Platform before product" is the biggest strategic attack.** We have zero shipped product and
   are describing a 5-plane platform. Defense: we build **one product end-to-end first** (Phase 1);
   the platform shape is only the *contracts*, not speculative tooling (pack SDK, Agent Runtime,
   link-graph are explicitly deferred). If we can't ship one motor product, the platform is moot —
   and we agree.
2. **Domain-agnostic is a discipline claim, not a proven one.** R4 (no domain words in the engine)
   is guarded by R2 (generic Signal model) but **not yet validated** — it's only real once a
   *second* domain pack ships (Phase 2) with zero engine change. Until then it's an aspiration.
3. **Buy-vs-build.** Extraction, vision, workflow engines, model gateways all exist as vendors/OSS.
   If we answer "we'll build all of it" we look naive. Correct answer: we *integrate* most and own
   only the **Signal model + fused Detect + pack/compliance layer** — that's the moat; the rest is
   wiring.
4. **Agent Runtime realism.** "Agentic" sounds great but determinism + auditability + cost are
   genuinely hard. It's Phase 3, it sits *on top of* the deterministic services, and it is NOT the
   near-term story. Don't let the room anchor on it.
5. **Nothing is proven yet — no customers, sample data, no published accuracy.** Every number on
   screen is illustrative. Say so before someone catches it.

---

# PART A — Adversarial back-test

**Legend:** ✅ survives · 🔧 needs a tweak · ⛔ genuine gap

### 1. Domain leakage into the engine — 🔧
**Attack:** the first paying insurer will demand a vehicle/IRDAI-shaped feature and it'll get
hard-coded into Vision/Detect; "generic" quietly dies.
**Verdict:** survives *by discipline*, not by construction. R2/R4 make it *possible* — Vision
returns a pack-defined feature schema, Detect reads a generic Signal set. But there is no compiler
stopping a dev from writing `if bumper`. **Tweak to promise:** a lint/CI check that fails on
domain nouns in engine packages, plus the pack-boundary code review. Honest line: "the guard is
R2 + review today; it's only *proven* when pack #2 ships unchanged."

### 2. Fused image+document checks (the moat) — ✅
**Attack:** "parts billed with no visible damage" needs Detect to understand both a repair estimate
and a dented bumper — that's domain logic, so Detect can't be generic.
**Verdict:** survives. Detect reads the **typed Signal set** (R2); every stage writes signals with
value + confidence + provenance. The *rule* "estimate line-item without a matching damage signal"
lives in the **motor pack**, not in Detect. Detect stays a generic rule engine over signals; the
cross-modal rule is pack config. This is the cleanest part of the design — lead with it.

### 3. Agent Runtime — 🔧 (and correctly deferred)
**Attack:** LLM agents are non-deterministic, expensive, hard to audit, and can be jailbroken —
unacceptable for a compliance product that "never auto-decides above a legal cap."
**Verdict:** survives *only because it's Phase 3 and bounded*. The agent calls the same capability
services as **tools**, is wrapped in the same guardrails (hard caps enforced by Decide, not the
agent), and its **reasoning trace is an audit artifact**. Real breakage risks: cost blowup on long
cases, latency, and eval. **Tweak:** position agentic as *assisted triage*, never as the auto-
approver. Don't oversell it tomorrow.

### 4. Compliance as policy-as-config — 🔧
**Attack:** health (DPDP + health-data), insurance (IRDAI), lending (RBI), residency — these are
not all "a config flag"; some need real engine behavior.
**Verdict:** mostly survives. Residency, consent lifecycle, retention/erasure, PII encryption,
purpose-limited access, audit export *are* enforceable as platform mechanisms driven by pack
declarations (R18). **Genuinely hard bits to admit:** (a) **Model Gateway residency routing** is
real only if every model endpoint is region-pinned and we redact before egress — that's
engineering work, not a flag, and it's the first thing that breaks with a foreign LLM API;
(b) some regimes impose *workflow* obligations (e.g. mandatory human step, grievance SLA) that live
in the pack's DAG, fine — but a brand-new obligation type could require an engine contract change.
Honest line: "80% is config; the Model Gateway region-pinning and novel obligation types are real
build items, not hand-waving."

### 5. Sync/async + priority — ✅ with known cost
**Attack:** expensive Vision/LLM stages + long human pauses will starve interactive users or blow
the bill.
**Verdict:** survives. Per-capability queues isolate expensive stages; priority classes
(`interactive > standard > batch`) + per-tenant fairness prevent starvation; durable orchestration
handles day-long human pauses without holding a connection. **Acknowledge:** priority/fairness is
easy to describe, non-trivial to tune; cost control on Vision/LLM is a real ops discipline (budget
caps per tenant/pack). No architectural gap, but it's a cost story, not a free lunch.

### 6. Multi-tenancy & cross-tenant link graph — 🔧
**Attack:** "privacy-preserving cross-insurer fraud checks" is the kind of claim that gets you sued
under DPDP; sharing entities across tenants is a data-isolation breach.
**Verdict:** single-tenant entity/link graph ✅. **Cross-tenant is the sharp one** and it is
explicitly **Phase 3, deferred.** The "privacy-preserving" mechanism (hashed/tokenised identifiers,
no raw PII shared) is credible *in principle* but unproven and legally sensitive. Honest line:
"cross-tenant is a roadmap ambition behind a privacy design we haven't validated with counsel —
not a Phase-1/2 promise."

### 7. Build sequencing / wrong early contract — 🔧
**Attack:** deferring the pack SDK and Agent Runtime means you'll discover the pack contract is
wrong after one product and rework everything.
**Verdict:** the sequencing (one product end-to-end → generalize on pack #2 → tool/SDK on ≥2 packs)
is **right** — you cannot design a good extension API from one example. **The real risk is the
Signal model (R2) and the pack contract**: get those wrong early and Phase 2 pays. Mitigation: treat
the Signal schema and pack-binding contract as the two interfaces we design most carefully in
Phase 1 and expect to version. Everything else can churn cheaply.

### 8. Buy vs build — 🔧 (CTO's likely lead attack)
**Attack:** extraction, OCR, vision damage models, workflow engines (Temporal), model gateways
(LiteLLM/Bedrock), even fraud scoring — all exist. What are we actually building?
**Verdict:** we should **buy/integrate the commodities and own the differentiators.**
- **Integrate:** OCR/doc-extraction models, foundation LLMs/VLMs, a durable workflow engine
  (Temporal-class), a model-gateway library, object storage, queue infra.
- **Build (the moat):** the **Signal model**, **fused cross-modal Detect**, the **pack/compliance
  layer** (policy-as-config enforcement), the **capture + quality** flow, and the **domain packs**.
- **License:** reference/pricing data.
Honest line: "we're not writing a VLM or a workflow engine from scratch; the IP is the composition
layer and the packs." If we don't say this, the CTO assumes we're boiling the ocean.

### 9. Scope/ambition — 🔧
**Attack:** too much platform, no PMF.
**Verdict:** valid tension. Defense = Phase 1 is a *product*, not a platform; platform-ness is
deferred contracts + not-yet-built tooling. If leadership wants, we can frame Phase 1 purely as
"motor inspection + fraud product" and never say "platform" externally until pack #2 proves it.

---

# PART B — Stakeholder Q&A

### CTO
**Buy vs build — what are we actually building vs integrating?**
Commodities bought/integrated (OCR, VLMs, workflow engine, model gateway, storage/queues). We own
the Signal model, fused Detect, the pack/compliance layer, capture+quality, and the packs. That
composition is the IP; the rest is wiring.

**What's the single biggest technical risk?**
The pack contract + Signal model being wrong early (Section A7). We design those two interfaces
most carefully in Phase 1 and expect to version them.

**Why not just ship a monolithic motor product and skip the platform?**
We are — Phase 1 *is* a monolith-shaped motor product. "Platform" = we keep domain nouns out of a
few core packages so pack #2 is cheap. The platform tax in Phase 1 is small (discipline + a CI
lint), the payoff is large if a second domain lands.

**Team size / can we even build this?**
Honest: scope is phased precisely because the team is finite. Phase 1 is a normal product build on
bought infra. If we can't staff Phase 1, nothing else matters — that's the gate.

**What happens when a foundation-model vendor changes pricing or API?**
Model Gateway isolates us — provider-agnostic routing, fallback, versioning. That's one of the few
things we build deliberately for exactly this reason.

### Software Architect
**Walk me through the Signal model — why is it load-bearing?**
Every stage writes typed signals (value + confidence + provenance) to the case; downstream stages
read the *set*, not each other's APIs. It's what lets Detect run on images-only, docs-only, or
fused, and keeps cross-modal rules in packs. It's R2 — the keystone.

**Fixed DAG vs Agent Runtime — why two orchestration modes? Isn't that two things to maintain?**
Yes, deliberately. The DAG is the Phase 1-2 workhorse (deterministic, auditable). The Agent Runtime
is Phase 3 and calls the *same* services as tools — not a parallel engine. If it earns its keep it
stays; if not, we drop it. We don't build it until the services exist.

**How do you actually prevent domain leakage in code?**
Today: pack boundary + review. Proposed: CI check failing on domain nouns in engine packages
(Section A1). Be honest it's discipline-enforced until pack #2 proves it.

**Event-sourced case — replay, schema migration, cost?**
The event log is the audit trail and the orchestration source of truth. Trade-off acknowledged:
event-schema versioning is real work; we accept it because audit/compliance needs the immutable
log anyway.

**Where do you version contracts?**
Pack-binding contract and Signal schema are the two we expect to version; everything else can churn.

### VP Engineering
**Phasing and what ships first?**
Phase 1: one product end-to-end (motor inspect + extract) on bought infra — capture, case, extract,
vision, basic decide, API+webhook+dashboard, compliance v1. Phase 2: verify, fused detect, estimate,
review/feedback, a *second domain pack*. Phase 3: agent runtime, link graph, pack SDK.

**What's explicitly deferred and why?**
Pack SDK (needs ≥2 packs), Agent Runtime (needs services first), cross-tenant link graph (needs a
customer + legal), audio modality. Deferring avoids designing APIs from one example.

**Delivery risk / where does the schedule slip?**
Signal + pack contract design (could cause Phase 2 rework); Model Gateway residency routing;
Vision/LLM cost tuning. Not the UI or the DAG.

**On-call / operational cost of async + queues?**
Per-capability queues + priority + per-tenant budget caps. Real ops discipline; no architectural
gap. It's a cost/tuning story, not a free lunch.

**Testing a non-deterministic agent?**
That's why it's Phase 3 and bounded to assisted triage with hard caps enforced by Decide, plus the
Eval registry. We don't ship it as an auto-approver.

### ML Team
**Do we train models or use foundation models?**
Non-goal to train foundation models. We integrate VLMs/LLMs via the Model Gateway and fine-tune /
prompt per pack where needed. Reference data is licensed. Our ML IP is the pack feature schemas,
fused-signal rules, and the eval/feedback loop.

**Where does training data / the feedback loop come from?**
Review Console corrections become labels (R6); Eval/Model Registry versions models + eval sets per
pack. That loop is how we *publish* accuracy later — not yet proven.

**How is accuracy measured and (eventually) published?**
Per capability, per pack, against held-out eval sets in the registry. Today: not measured in prod,
not published. Don't claim a number tomorrow.

**Vision features are domain-specific — how is that "generic"?**
Vision returns a *pack-defined* feature schema; the engine never names "bumper." Generic plumbing,
domain-specific schema. The model binding is pack config.

**Model/residency constraints on where inference runs?**
Model Gateway must region-pin endpoints and redact before egress for restricted PII — real build
work, honestly the first compliance thing that breaks with a foreign API.

### Chief Strategy Officer
**Why a platform and not a focused product — where's the moat?**
Many adjacent problems share one shape (evidence → understand → verify → cost → decide). Build the
shape once, sell many products; marginal cost of product N+1 is a pack. Moat = fused cross-modal
checks + compliance-by-construction + owned packs/data, not damage detection (that's commoditizing).

**Compliance as a USP — is that real or marketing?**
Real and defensible: built once, inherited by every pack, so every product is compliant for its
domain on day one. Caveat internally: Model Gateway region-pinning and novel obligation types are
build work (Section A4).

**What's the expansion story / TAM beyond motor?**
Same engine → lending collateral, KYC, health claims, fleet before/after, used-car, media
authenticity (packs in docs §4). Expansion = packs, not rebuilds. But *unproven* until pack #2.

**Competitors already do damage AI — why do we win?**
We don't compete on damage-detection accuracy as the headline. We read the *whole* case — photos +
documents + records — fuse them, and decide with compliance. Rivals read one modality.

**Timeline to a second vertical?**
Phase 2. Deliberately not promised as a date — it gates on Phase 1 shipping and the pack contract
holding.

### PM
**What can I actually sell first, and to whom?**
Phase 1: a motor inspection + fraud product for insurers/financiers (dashboard + API + capture link
+ PDF/JSON + webhook). Self-serve-able capabilities, enterprise for carriers.

**How do I stand up a new product without engineering?**
A product = pack (schemas, model bindings, source connectors, reference data, rules, DAG, thresholds,
report template) + entitlements + surface. You assemble; engineering doesn't touch the engine —
*after* the pack tooling exists (Phase 3); before that, engineering hand-authors packs with you.

**Can customers buy one capability alone?**
Yes — capabilities are independently entitled (e.g. Verify-only, or Inspect+Detect). That's the
cohort/subset model (R1 DAG + entitlements).

**What's sample vs real in the demo?**
All of it is sample/illustrative today — no named customers, no published accuracy. Say so.

**What's the roadmap I can credibly promise?**
Phase 1 motor product. Everything else (second vertical, agentic, cross-insurer) = roadmap, not
dates.

---

## Do NOT overclaim tomorrow
- **No named customers, logos, or testimonials.** "Design-partner" framing only.
- **All data on screen is sample/mock.** The demo form isn't wired.
- **No published accuracy numbers** — the measurement loop is Phase 2+.
- **Agent Runtime, cross-tenant link graph, pack SDK = roadmap (Phase 3).** Not built, not promised.
- **"Domain-agnostic" is unproven until pack #2 ships** — call it the design intent, not a result.
- **Health/lending compliance** = design intent; only motor regime is being built first.
- **"Modules" and "Mimir" are working names.** Don't harden brand around them.
