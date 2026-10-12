# 4 · Domains

> A **domain** is a category the platform serves. A domain is expressed entirely as a **pack** —
> never as engine code. This file lists the domains we can serve and what each pack supplies.

## A domain = a pack

Every domain binds the same six slots. The engine is identical across all of them; only these
bindings differ.

| Pack slot | What it is | Feeds |
|---|---|---|
| **Schemas** | The entities/fields that matter in this domain | Extract, Vision |
| **Feature schema** | What Vision should detect/measure | Vision |
| **Source connectors** | Which registries/APIs are authoritative | Verify |
| **Reference data** | Catalogs / price-lists / rate-cards | Estimate |
| **Rules + weights** | What is risky / invalid here | Detect |
| **Policy** | Workflow DAG or agent policy, thresholds, hard limits, report template | Orchestration, Decide |

## Domains we can serve

| Domain | Example products | Feature schema (Vision) | Sources (Verify) | Reference data (Estimate) | Risk rules (Detect) |
|---|---|---|---|---|---|
| **Motor / vehicle** | P1, P4, P5, P10 | damage, parts, severity, plate, odometer | RC/Vahan, DL, PAN, GST | parts catalog, labour rates | tampering, inflation, claims links, story-fit |
| **Property** | valuation, damage claims | rooms, fixtures, damage area | land/title registries | material & labour rates | over-scoping, duplicate claims |
| **Health** | claim document checks | medical imagery, bill line-items | provider/registry lookups | procedure/drug price lists | up-coding, duplicate billing |
| **Lending / financial** | P8, P9 | collateral condition | bank, PAN, GST, bureau | collateral valuation tables | duplicate financing, identity mismatch |
| **Logistics / fleet** | P10 | condition before/after, seals | fleet registries | — | transit-damage disputes |
| **Used-car / resale** | condition grading | condition, odometer, parts | RC/Vahan, loan-on-RC | resale price guides | odometer rollback, ownership |
| **Identity / KYC** | P6, P8 | — (document-first) | ID registries | — | forgery, mismatch, synthetic ID |
| **Media / content** | P11 | tamper/AI-gen signals | — | — | manipulation, re-digitisation, reuse |
| **Finance / enterprise** | P12 | — (document-first) | GST, bank | — | invoice inflation, duplicate, mismatch |

## What the engine must never assume

Driven by **R4** (the existential risk). None of these may appear in engine code — only in a pack:

- A specific feature vocabulary (e.g. "bumper", "fracture", "room"). Vision returns a *pack-defined*
  feature schema.
- A specific source of truth (e.g. Vahan). Verify calls *pack-selected* connectors.
- A specific price basis. Estimate reads *pack-bound* reference data.
- A specific risk rule or threshold. Detect/Decide run *pack-supplied* rules and limits.

If a new domain needs something none of the six slots can express, that is a **signal to extend the
engine contract deliberately** — not to special-case the domain in engine code.

## Expansion model

Category N+1 = a new pack (six bindings) + entitlements + surface. **Zero engine change.** The
platform's leverage is that the hardest, most expensive parts (ingestion, orchestration, model
gateway, audit, review/feedback) are built once and shared across every domain above.
