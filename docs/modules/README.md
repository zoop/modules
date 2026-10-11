# Mimir — the Modules intelligence engine

> **Codename:** **Mimir** (Norse: keeper of the well of wisdom — the counsel you consult before
> you decide; the human still decides). The engineering platform. Slots beside `bragi` under the
> repo's Norse-codename convention.
> **Status:** Draft for review · **Scope:** platform engineering architecture, product-agnostic
> **Names:** **Modules** is the provisional product/market name; **Mimir** is the engine codename.

## In one paragraph

**Modules** is a domain-agnostic intelligence platform: one engine that turns raw evidence —
images, video, documents, structured data — into a verified, risk-scored, costed, auditable
decision, delivered by API, webhook and a no-install capture link. The engine knows nothing about
any industry. **Domain knowledge is injected as a *pack*, never built in.** Product managers build
products (vehicle inspection, document extraction, a fraud engine, an agentic assistant, …) by
authoring a pack and choosing entitlements — not by changing the platform. New category = a new
pack, **zero engine change**.

## How to read these docs (in order)

1. [`01-platform-goal.md`](./01-platform-goal.md) — the engineering goal and what "done" means.
2. [`02-component-architecture.md`](./02-component-architecture.md) — the component architecture:
   the planes, every component, one diagram.
3. [`03-products-and-usecases.md`](./03-products-and-usecases.md) — sample products and use cases,
   each **back-tested** against the architecture; the gaps this surfaced and the components added.
4. [`04-domains.md`](./04-domains.md) — the domains we can serve and how each becomes a pack.
5. [`05-detailed-architecture.md`](./05-detailed-architecture.md) — the deep dive: capability
   services, the signal model, orchestration modes, data flow, contracts.
6. [`06-build-phases.md`](./06-build-phases.md) — how we build it, in phases.

## Glossary (read first — the names collide otherwise)

| Term | Meaning |
|---|---|
| **Platform / engine** | The domain-agnostic intelligence pipeline, built once. |
| **Capability service** | One engine capability — usable *and* sellable alone (Capture, Extract, Vision, Verify, Detect, Estimate, Decide). |
| **Pack** | A domain configuration that lights up the engine for one category. |
| **Product** | A pack + entitlements + branding + surface, assembled by a PM. |
| **Case** | The unit of work — one event start-to-finish; everything hangs off it. |
| **Signal** | A typed output any stage writes to the case; downstream stages read the whole set. |
| **Pack vs product** | A pack is the config; a product is a pack made sellable (entitlements, pricing, surface). |
