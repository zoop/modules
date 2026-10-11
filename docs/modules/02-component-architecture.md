# 2 · Component Architecture

> The map of what we build. Everything here is **domain-agnostic**. Domain specifics live in packs
> ([`04-domains.md`](./04-domains.md)). Components marked **(added by back-test)** were forced by
> running the sample products through the design — see [`03-products-and-usecases.md`](./03-products-and-usecases.md).

## The component map

```
┌─ EDGE / DELIVERY ─────────────────────────────────────────────────────────┐
│ Capture-Link Svc · API Gateway · Webhook/Event Delivery · Dashboard BFF ·  │
│ File Ingest · Capture-Quality / Preprocessing (added by back-test)         │
└─────────────────────────────────────────────────────────────────────────────┘
┌─ CASE PLANE ──────────────────────────────────────────────────────────────┐
│ Case Svc (event-sourced) · Evidence Store (content-addressed) ·            │
│ Signal Model (typed outputs) · Entity / Link Graph (added by back-test)    │
└─────────────────────────────────────────────────────────────────────────────┘
┌─ INTELLIGENCE ENGINE — capability services ───────────────────────────────┐
│ Extract(schema) · Vision(features) · Verify(sources) · Detect(rules) ·     │
│ Estimate(reference data) (added by back-test) · Decide(thresholds)         │
└─────────────────────────────────────────────────────────────────────────────┘
┌─ ORCHESTRATION (two modes) ───────────────────────────────────────────────┐
│ Workflow Engine — deterministic pack-defined DAG                           │
│ Agent Runtime — LLM drives, services are tools (added by back-test)        │
└─────────────────────────────────────────────────────────────────────────────┘
┌─ SHARED ENGINE SERVICES ──────────────────────────────────────────────────┐
│ Model Gateway (added by back-test) · Reference Data (added by back-test) · │
│ Pack Registry (schemas, rules, bindings, policy, entitlements)             │
└─────────────────────────────────────────────────────────────────────────────┘
┌─ CROSS-CUTTING ───────────────────────────────────────────────────────────┐
│ Identity/Tenancy · Entitlements · Audit Log · Metering/Billing ·           │
│ Review Console + Feedback loop · Eval/Model Registry ·                     │
│ Compliance plane (added by back-test — and a USP)                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components at a glance

### Edge / Delivery — how any product reaches the world
| Component | Responsibility |
|---|---|
| **Capture-Link Service** | No-install, time-boxed links (SMS/WhatsApp/email); guided capture; consent recorded with the case. |
| **API Gateway** | REST + webhooks; per-tenant auth (sandbox/live), rate limits, idempotency, routing. |
| **Webhook / Event Delivery** | Signed, retried, replayable outbound events on every case state change. |
| **Dashboard BFF** | Backend-for-frontend for the enterprise console. |
| **File Ingest** | Presigned uploads, malware scan, format/size validation. |
| **Capture-Quality / Preprocessing** *(added)* | Real-time quality gating (blur/glare/coverage), deskew/denoise, re-shoot guidance. The "best capture" capability. |

### Case plane — the system of record
| Component | Responsibility |
|---|---|
| **Case Service** | Event-sourced unit of work; the log *is* the audit trail. |
| **Evidence Store** | Content-addressed raw artifacts; retention + residency per pack/tenant. |
| **Signal Model** | Typed outputs every stage writes and every downstream stage reads (load-bearing — see detailed arch). |
| **Entity / Link Graph** *(added)* | Cross-case entity resolution and links (claims rings, duplicate financing, cross-tenant shared checks, privacy-preserving). |

### Intelligence engine — the capability services
`Extract` · `Vision` · `Verify` · `Detect` · `Estimate` *(added)* · `Decide`. Each has a stable
domain-neutral contract; a pack supplies its schema/model/rules/reference-data. Full specs in
[`05-detailed-architecture.md`](./05-detailed-architecture.md).

### Orchestration — two modes, same services
| Mode | Use |
|---|---|
| **Workflow Engine** | Deterministic, pack-defined DAG; durable; partial-input tolerant; human-in-the-loop pauses. Default for structured products. |
| **Agent Runtime** *(added)* | An LLM reasons over the case and calls capability services as **tools**; guardrailed; case-scoped memory; full reasoning trace for audit. Powers "agentic" products. |

**Execution model (orthogonal to mode):** every capability is reachable **sync** (request/response,
single-shot, low-latency) *and* **async** (case-based, webhook on completion). Async work carries a
**priority class** (`interactive` > `standard` > `batch`), per-capability queues, and per-tenant
fairness. Detail in [`05-detailed-architecture.md`](./05-detailed-architecture.md) §5.3.

### Shared engine services
| Component | Responsibility |
|---|---|
| **Model Gateway** *(added)* | Provider-agnostic access to LLMs/vision models (own + third-party): routing, fallback, versioning, cost/latency control. Used by Extract, Vision, Detect, Estimate, Agent Runtime. |
| **Reference Data** *(added)* | Versioned catalogs/price-lists/rate-cards (distinct from identity sources). Powers Estimate. |
| **Pack Registry** | Versioned store of each pack: schemas, rules, thresholds, prompts, model + reference-data bindings, workflow DAG / agent policy, entitlements. Sandbox vs live. |

### Cross-cutting
Identity/Tenancy · Entitlements (which services a tenant may call) · Audit Log · Metering/Billing ·
**Review Console + Feedback loop** (human decisions + corrections become labels) · **Eval/Model
Registry** (versioned models + eval sets → published accuracy) · **Compliance plane** *(added)* —
policy-as-config per pack, enforced by the platform at runtime (residency, consent lifecycle,
retention/erasure, PII, purpose-limited access, regulator-grade audit, decision guardrails,
certification posture). Built once, inherited by every pack — **"compliant by construction" is a
product USP.** Detail in [`05-detailed-architecture.md`](./05-detailed-architecture.md) §5.7.

## What a PM touches vs. what engineering owns

- **Engineering owns, builds once:** everything in Edge, Case, Engine, Orchestration, Shared
  (minus pack contents), and Cross-cutting.
- **A PM assembles a product from:** a **Pack Registry** entry + **Entitlements** + **Surface**.
  No code in the engine.
