# 6 · Build Phases

> How we build the platform without boiling the ocean. The rule throughout: build generic
> **contracts** early; build generic **tooling** only when a *second* real product proves the shape.
> One example can't design a good extension API.

## Sequencing principle

The capability services are the hard dependency — the Agent Runtime, the Entity Graph, and any
pack-authoring tooling all sit *on top of* services that must exist first. So we build **one real
product end-to-end**, then the shared parts that a **second** product forces, then the
cross-product leverage.

## Phase 1 — One product, end to end *(prove the spine)*

**Goal:** evidence in → decision out, for a single product (Vehicle inspection + Document
extraction), via API + link + dashboard, with webhooks and an audit trail.

- **Edge:** Capture-Link, API Gateway (sync **and** async endpoints), Webhook delivery, File
  Ingest, **Capture-Quality**.
- **Case:** Case Service (event-sourced), Evidence Store, **Signal model**.
- **Engine:** Extract, Vision, basic Decide. Behind the **Model Gateway** from day one.
- **Orchestration:** Workflow Engine (deterministic DAG) only. Sync for single-shot calls; async
  with **priority classes** for full cases.
- **Cross-cutting:** Identity/Tenancy, Audit Log, basic Metering, **Compliance plane v1**
  (residency, consent, retention, PII encryption) — compliance is foundational, not deferred.
- **Pack:** one motor pack. No pack tooling yet — config checked in and reviewed by engineering.

**Exit:** one product live; every decision explainable + auditable.

## Phase 2 — Depth + a second product *(prove the pack boundary)*

**Goal:** stand up a second product in a different domain **without engine changes**, and add the
capabilities the richer products need.

- **Engine:** Verify (+ Source-of-Truth connector interface), Detect (fused signals via the Signal
  model), **Estimate + Reference-Data plane**.
- **Case:** multi-session + Vision **compare** mode (before/after).
- **Orchestration:** entitlements + per-tenant fairness; richer priority/SLA tiers.
- **Cross-cutting:** **Review Console + Feedback loop**, **Eval/Model Registry** (publish accuracy),
  **Compliance plane v2** (purpose-limited access, regulator export, per-domain regimes e.g. health).
- **Pack:** a second domain pack (e.g. KYC/lending or health) — the real test of R4 (no vehicle
  concept in the engine).

**Exit:** two products, two domains, one engine, no forks.

## Phase 3 — Leverage across products *(only now generalise)*

**Goal:** the capabilities that only make sense once services + multiple packs exist.

- **Agent Runtime** — capability services as tools; powers "agentic" products. (Needs the services
  from Phases 1–2 as its toolset.)
- **Entity / Link Graph** — cross-case and privacy-preserving cross-tenant link fraud.
- **Pack-authoring tooling** — schema/rule/threshold authoring, versioning, sandbox→live promotion.
  Built **now**, against ≥2 real packs — not before.
- **Compliance plane v3** — certification posture (SOC 2 / ISO / DPDP), model-decision provenance
  as a published differentiator.
- **More domains** — each a pack, zero engine change.

## What we deliberately defer (and why)

| Deferred | Until | Why |
|---|---|---|
| Pack-authoring SDK / marketplace | ≥2 real packs (Phase 3) | Can't design a good extension API from one example |
| Agent Runtime | Services exist (Phase 3) | The services are its tools; no tools, no agent |
| Cross-tenant link graph | A product needs it (Phase 3) | Heavy + privacy-sensitive; speculative before demand |
| Call-recordings / audio modality | A product needs it | New modality on the same Capture/Signal contracts |

## Dependency snapshot

```
Signal model + Case ──┬─▶ capability services (Extract, Vision, Verify, Detect, Estimate, Decide)
Model Gateway ────────┘            │
                                   ├─▶ Workflow Engine ─▶ products (Phase 1–2)
                                   └─▶ Agent Runtime ───▶ agentic products (Phase 3)
Compliance plane ─ enforced across every phase, deepening v1 → v3
```
