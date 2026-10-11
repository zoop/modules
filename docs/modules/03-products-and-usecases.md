# 3 · Products, Use Cases & Back-Test

> The method: take real products we want to build, run each through the component architecture,
> and find what it needs that the architecture **doesn't have yet** — then add that component.
> The architecture in [`02-component-architecture.md`](./02-component-architecture.md) is the
> *result* of this exercise. **The idea does not fail** — the engine + packs split holds for every
> product below — but the back-test forced eighteen requirements.

## Sample products

The seven you named, plus six I've added to widen the back-test (non-vehicle, agentic, media,
cross-case). Each is a product a PM could assemble from the platform.

| # | Product | Capabilities used | Domain |
|---|---|---|---|
| P1 | **Vehicle inspection** | Capture, Capture-Quality, Vision | Motor |
| P2 | **Document extraction** | Capture, Capture-Quality, Extract | Any |
| P3 | **Agentic AI assistant** | Agent Runtime over all services | Any |
| P4 | **Estimate-from-images** | Vision, Estimate, Reference Data | Motor / property |
| P5 | **Fraud engine** | Detect (+ Entity/Link Graph) | Any |
| P6 | **Verification engine** | Verify (+ source connectors) | Identity-bearing |
| P7 | **Best capture + extraction** | Capture-Quality, Capture, Extract, Vision | Any |
| P8 | **KYC / onboarding** *(added)* | Extract, Verify, Detect | Financial / telco |
| P9 | **Lending collateral valuation** *(added)* | Vision, Estimate, Verify | Lending |
| P10 | **Before/after condition monitoring** *(added)* | Capture, Vision (compare) | Fleet / logistics / warranty |
| P11 | **Media authenticity / tamper check** *(added)* | Detect (on images alone) | Any |
| P12 | **Invoice / expense audit** *(added)* | Extract, Detect | Finance / enterprise |
| P13 | **Health claim checks** *(added)* | Extract, Vision, Detect, Decide | Health (compliance-heavy) |

## Back-test — what each product stressed, and the gap it forced

| Product | What it stresses | Gap it exposed → requirement |
|---|---|---|
| P1 Vehicle inspection | Vision must return motor features without the engine knowing "damage" | Engine vocabulary must stay generic → **R4** |
| P2 Document extraction | A standalone extract product needs schema management + correction UI | Pack Registry for schemas → **R15**; review as a product surface → **R16** |
| P3 **Agentic AI** | The design only had a *deterministic* DAG; an agent must reason and pick steps dynamically | **Agent Runtime** (services-as-tools, guardrails, trace) → **R9**; a **Model Gateway** to call LLMs → **R10** |
| P4 **Estimate-from-images** | Mapping detected features → cost needs priced reference data + a calc capability | **Reference-Data plane** → **R11**; **Estimate** capability service → **R12** |
| P5 Fraud engine | "Links across claims", duplicate financing, cross-insurer checks aren't single-case | **Entity / Link Graph** → **R13** |
| P6 Verification engine | Government/registry rails must plug in, async, fail-soft | **Source-of-Truth connector interface** → **R5** |
| P7 **Best capture** | Capture quality is itself the product and a shared enhancer | **Capture-Quality / Preprocessing** component → **R14** |
| P8 KYC (non-vehicle) | Nothing vehicle-specific may leak into the engine | Confirms **R4**; packs own all domain schema |
| P9 Lending valuation | Estimate + Verify composed in a non-insurance domain | Confirms **R11/R12** are domain-neutral |
| P10 Before/after | Compare two capture sessions — "what changed?" | Multi-session case + Vision compare mode → **R3** |
| P11 Media authenticity | Detect must run on images alone (manipulation/AI-generation) | Confirms **R2** (Detect reads a generic signal set, any subset) |
| P12 Invoice audit | Detect on documents alone (inflation, mismatch) | Confirms **R2**; Detect is modality-agnostic |
| P13 Health claims | Health-data sensitivity, DPDP, residency, consent, purpose limits — *different per domain* | **Compliance plane** → **R18** (supersedes R8); compliance-aware model routing |
| A customer waiting at a link vs. a bulk batch job | Not all async work is equal; single-shot calls need a sync path | **Sync + async with priority classes** → **R17** |

## The eighteen requirements

Carried from the first back-test (R1–R8) and added by these products (R9–R18).

| # | Requirement | Forced by |
|---|---|---|
| R1 | Pipeline is a **pack-defined DAG**, not a fixed linear line (stages optional) | subset products (P6, P2) |
| R2 | A shared typed **Signal model** on the case — the thing that makes fused checks generic *(load-bearing)* | P5, P11, P12 |
| R3 | Case holds **ordered capture sessions + a compare op** | P10 |
| R4 | **Engine vocabulary stays generic**; domain concepts live only in packs | P1, P8 |
| R5 | **Source-of-Truth connector interface** (async, cached, fail-soft) | P6 |
| R6 | A **Feedback & Eval plane** (labels from review, eval harness, model registry) | publishing accuracy; training loop |
| R7 | **Durable, long-lived orchestration** (human review can take days) | P1–P12 Decide/Flow |
| R8 | **PII / residency / retention as pack+tenant policy** | identity-bearing products |
| R9 | **Agent Runtime** — LLM drives, capability services are tools, guardrailed, traced | P3 |
| R10 | **Model Gateway** — provider-agnostic model access, routing, versioning | P3 + all model-using services |
| R11 | **Reference-Data plane** — versioned catalogs/price-lists/rate-cards | P4, P9 |
| R12 | **Estimate** capability service — features + reference data → itemized cost | P4, P9 |
| R13 | **Entity / Link Graph** — cross-case entity resolution & link fraud | P5 |
| R14 | **Capture-Quality / Preprocessing** component | P7 |
| R15 | **Pack Registry** — versioned schemas, rules, bindings, policy, entitlements (sandbox/live) | P2 and all |
| R16 | **Review Console as a productizable surface**, not just a feedback sink | P2 |
| R17 | **Dual execution: sync + async**, async with **priority classes** + per-capability queues + per-tenant fairness | live-link vs batch work |
| R18 | **Compliance plane** — policy-as-config per pack, enforced by the platform (residency, consent lifecycle, retention/erasure, PII, purpose-limited access, regulator-grade audit, decision guardrails, certification posture). **A USP.** Supersedes R8 | P13 + every identity/health/finance product |

## Verdict

- **The platform thesis survives every product.** Each is "evidence → understand → check → cost →
  decide," composed from the same services with a different pack.
- **Compliance holds the thesis too.** Different regimes per domain (health/DPDP, insurance/IRDAI,
  lending/RBI, residency everywhere) do **not** fork the engine: each pack *declares* its regime and
  the **Compliance plane enforces it at runtime** (R18). Because it is built once and inherited by
  every pack, "compliant by construction" becomes a **selling point**, not a per-product cost. One
  caveat it forced: the **Model Gateway must be compliance-aware** — never route restricted PII to a
  non-compliant model/region, and redact before egress.
- **What changed:** the engine gained one capability service (**Estimate**), a second orchestration
  mode (**Agent Runtime**), four shared/cross-cutting components (**Model Gateway**, **Reference
  Data**, **Entity/Link Graph**, **Capture-Quality**), a **dual sync/async execution model with
  priority** (R17), and a **Compliance plane** (R18). All are in
  [`02-component-architecture.md`](./02-component-architecture.md) and detailed in
  [`05-detailed-architecture.md`](./05-detailed-architecture.md).
- **The one existential risk** is R4 — domain vocabulary leaking into the engine. It is a
  discipline problem, guarded by R2 (services speak generic signals) and the pack boundary.
- **Scope discipline (lazy-but-right):** build generic *contracts* now; do **not** build a pack-
  authoring SDK, plugin marketplace, or the cross-tenant link graph until a *second* real product
  needs them. One example can't design a good extension API. See [`06-build-phases.md`](./06-build-phases.md).
