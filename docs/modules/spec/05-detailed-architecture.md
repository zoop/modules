# 5 · Detailed Architecture

> The deep dive behind [`02-component-architecture.md`](./02-component-architecture.md): the
> capability-service contracts, the signal model, the execution model (sync/async + priority),
> the two orchestration modes, and the compliance plane. Everything domain-agnostic.

## 5.1 Capability services

Each service has a stable domain-neutral contract; a pack supplies the schema/model/rules/
reference-data it runs with. Each is usable **alone** (sync or async) and **composed** (as a
workflow/agent step).

| Service | Does | In → Out | Pack injects | Sold as |
|---|---|---|---|---|
| **Capture** (+ Capture-Quality) | Collect evidence, no install; gate quality | capture request → link/upload → validated artifacts + consent | capture script, quality thresholds, consent copy, language | per session |
| **Extract** | Documents → structured fields | documents → typed field signals + source spans + confidence | document schemas, model binding | per document/page |
| **Vision** | Images/video → domain features; or **diff** two sessions | media → feature signals (regions, classes, scores) per pack schema | feature schema, vision model binding | per inspection/comparison |
| **Verify** | Prove authenticity/consistency vs sources | entities → match/mismatch signals + figures | which Source-of-Truth connectors, cross-check rules | per verification/lookup |
| **Detect** | Risk score over the whole signal set, with reasons | case signals (any subset) → pass/fail checks + score | rule set + weights | per case scored |
| **Estimate** | Features → itemised cost / repair-vs-replace | feature signals + reference data → costed line items | reference-data binding, calc config | per estimate |
| **Decide** | Thresholds: auto-clear vs route to human | risk/estimate signals + thresholds → decision + flags | thresholds, routing, hard limits | per decision |

**Outputs (every service):** structured JSON + branded PDF + an immutable audit entry. The report
is the **union** of whatever stages ran — a customer never pays for a section they didn't use.

## 5.2 The Signal model *(R2 — load-bearing)*

Every stage writes **typed Signals** to the case; downstream stages read the *whole set*, not each
other's APIs. This is what keeps the engine generic while enabling fused checks:

- Detect can score on images alone (P11), documents alone (P12), or **both fused** (P1/P5) — it
  just reads whichever signals exist. The fused checks ("parts billed with no visible damage",
  "plate in photo vs RC") are only generic because they are rules over a generic signal set, not
  code that knows about vehicles.
- A Signal carries: type, source stage, value (pack-schema-shaped), confidence, and provenance
  (which artifact/figure it came from) — provenance is what makes every flag explainable (R6) and
  auditable (R8/R18).

## 5.3 Execution model — sync, async, and priority *(R17)*

The **same capability service** is reachable two ways:

- **Sync (request/response).** Low-latency, single-shot, bounded work: "verify this PAN", "extract
  this one doc", "is this image tampered". Returns inline. Used when the caller needs an answer now.
- **Async (case-based).** Long-running, multi-stage, human-in-the-loop, or heavy model work: create
  a case → `202` + case id → **webhook** on completion. Default for full products.

**Priority inside async** — not all async work is equal:

- **Priority classes:** `interactive` (a customer waiting at a capture link) > `standard` > `batch`
  (bulk re-processing). Set per pack/product, overridable per request; maps to SLA tier.
- **Per-capability queues + autoscaling:** Vision and LLM work is expensive and bursty; each
  capability has its own queue so a backlog in one never blocks another.
- **Per-tenant fairness:** no tenant starves others; quotas enforced at the gateway + queue.

## 5.4 Orchestration — two modes

| Mode | How it runs | When |
|---|---|---|
| **Workflow Engine** *(R1, R7)* | A durable, pack-defined **DAG** of stages over the case; stages optional; pauses for human review for days; retries; emits an event per transition | Structured products with a known flow |
| **Agent Runtime** *(R9)* | An LLM reasons over the case and calls capability services as **tools**; bounded by guardrails (incl. compliance, §5.7); case-scoped memory; a full **reasoning trace** that is itself an audit artifact | "Agentic" products; open-ended triage |

Both modes call the same services and go through the **Model Gateway** *(R10)*: provider-agnostic
access to LLMs/vision models (own + third-party) with routing, fallback, versioning, and
cost/latency control. **The gateway is compliance-aware** — it will not route restricted PII to a
non-compliant model or region, and redacts before egress (see §5.7).

## 5.5 Reference Data & Estimate *(R11, R12)*

- **Reference Data plane:** versioned catalogs / price-lists / rate-cards, distinct from identity
  Source-of-Truth connectors. Licensed data lives here, versioned so estimates are reproducible.
- **Estimate** maps feature signals → itemised cost using the pack's bound reference-data set.
  Generic: vehicle parts, property materials, medical procedures — all the same shape.

## 5.6 Entity / Link Graph *(R13)*

Cross-case entity resolution + a link graph: the same vehicle/person/payee/invoice seen across
cases, and the links between them (claims rings, duplicate financing). Cross-tenant checks are
**privacy-preserving** (hashed/tokenised identifiers, no raw PII shared). Deferred until a second
product needs it — see phases.

## 5.7 Compliance plane *(R18 — and a USP)*

Different domains carry different regimes (health data sensitivity + DPDP; insurance IRDAI +
legal auto-approve caps; lending RBI/KYC; residency everywhere). We make **"compliant by
construction"** a platform property: a pack **declares** its regime, and the platform **enforces**
it at runtime — compliance is not re-implemented per product.

Policy-as-config, enforced by the platform:

| Control | Enforced as |
|---|---|
| **Data residency** | Where evidence + PII are stored *and processed* (incl. model routing, §5.4) |
| **Consent lifecycle** | Captured, versioned, checked **before** processing; withdrawal honoured |
| **Retention & erasure** | Per data class; right-to-erasure; auto-expiry |
| **PII handling** | Field-level encryption, tokenisation, redaction, data minimisation |
| **Purpose-limited access** | Who/what may read which signals, for what declared purpose |
| **Regulator-grade audit** | Immutable, exportable case history (the event log) |
| **Decision guardrails** | Decide never auto-clears above a legal/customer cap; AI-decision provenance recorded |
| **Posture** | Org certifications (SOC 2, ISO 27001, DPDP) + model/eval provenance for defensibility |

Because this is built once and inherited by every pack, compliance becomes a **selling point** —
every product on Modules is compliant for its domain the day it ships, which is exactly the kind
of expensive common part a platform exists to amortise.

## 5.8 Feedback & Eval *(R6)*

The Review Console captures human decisions and **corrections as labels**; the Eval/Model Registry
versions models + eval sets per pack. This powers the training loop ("every correction improves the
engine") and lets us **publish accuracy** per capability per pack — a differentiator in a market of
vendor-claimed numbers.

## 5.9 One case, end to end (data flow)

```
link/API → File Ingest → Capture-Quality (re-shoot if poor) → Case created (consent, residency set)
   → Orchestration (DAG or Agent) runs enabled stages, each writing Signals:
        Extract · Vision · Verify(connectors) · Estimate(ref data) · Detect(rules over all signals)
   → Decide (thresholds, hard caps) → clear | route-to-human (Review Console)
   → Outputs: JSON + PDF + audit entry → Webhook to customer systems
   (every step: compliance-enforced, metered, audit-logged; corrections → labels)
```
