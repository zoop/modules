# 1 · Platform Goal

> Engine codename: **Mimir**. "Modules" is the provisional product/market name.

## Engineering goal

Build **one engine** that turns raw evidence into a trusted decision, and make every industry
specific thing a **configuration on top of it**, so that:

- A new product is launched by writing a **pack** + setting **entitlements** + pointing a
  **surface** at a market — with **no change to the engine**.
- Every capability (capture, extraction, vision, verification, risk, estimation, decisioning) is
  **independently usable and sellable**, and also **composes** into a whole.
- The same codebase runs **many products across many domains** at once.

## Why a platform and not a product

The market has many adjacent problems that are the *same shape*: collect evidence → understand it
→ check it against truth → score/cost it → decide, auto or human. Building each as a bespoke
product means rebuilding that shape every time. Building the shape **once** and injecting domain
knowledge means the marginal cost of the next product is a pack, not a platform.

This also hands product managers the freedom they actually need: to chase a different market or a
different competitor by writing configuration, while engineering keeps building depth in the
common engine.

## Non-goals

- **Not** a single-vertical product. Any vertical is a pack; none is privileged in the engine.
- **Not** a bespoke-per-customer build. Customers get entitlements + a pack, not a fork.
- **Not** a model lab. We integrate and route models (own and third-party) through a gateway; we
  are not in the business of training foundation models.

## What "done" looks like

- One product is live end-to-end on the platform (evidence in → decision out, via API + link +
  dashboard, with webhooks and an audit trail).
- A **second product in a different domain** is stood up **without engine changes** — proving the
  pack boundary is real.
- Every automated decision is **explainable and auditable**, and human corrections **feed back**
  into the models and rules.
- We can **measure and publish** accuracy per capability, per pack.

## The two planes (the whole idea in one picture)

```
PRODUCT LAYER (per category — assembled by PMs, no engine change)
  pack { schemas · model bindings · source connectors · reference data ·
         rules · workflow/agent policy · thresholds · report template }
       + entitlements + branding + surface
  ───────────────────────────────────────────────────────────────────────
PLATFORM (built once — domain-agnostic)
  Edge/Delivery · Case · Intelligence Engine · Orchestration · Cross-cutting
```
