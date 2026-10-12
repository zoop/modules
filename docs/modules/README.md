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

## Start here

**Open [`index.html`](./index.html)** — the hub. Everything below is reachable from its sidebar.

## Folder map

| Path | What it is |
|---|---|
| `index.html` | **The hub** — agenda, visual pages, module chapters and specs, one connected site |
| `spec/01…06-*.md` | The written specs: goal → component architecture → products & back-test → domains → detailed architecture → build phases |
| `pages/` | The standalone pages: `agenda`, `diagram` (one case end-to-end), `components` (five planes), `backtest` (13×18 matrix), `presentation` (16-slide deck), `speaker-crib`, and the seven `module-*` chapters |
| `demos/` | Working product demos (sample data) — e.g. `motor-fraud-engine/`, embedded in the hub under “Demos” |
| `meeting/meeting-qa.md` | Adversarial meeting-prep brief: thin ice, per-role Q&A |
| `tools/generate-*.mjs` | Generators — `index.html` and the module pages are **generated**; edit the generator (or the `spec/*.md`), then `node tools/generate-index.mjs && node tools/generate-module-pages.mjs` |

## Reading order for the specs

1. [`spec/01-platform-goal.md`](./spec/01-platform-goal.md) — the engineering goal and what "done" means.
2. [`spec/02-component-architecture.md`](./spec/02-component-architecture.md) — the component architecture:
   the planes, every component, one diagram.
3. [`spec/03-products-and-usecases.md`](./spec/03-products-and-usecases.md) — sample products and use cases,
   each **back-tested** against the architecture; the gaps this surfaced and the components added.
4. [`spec/04-domains.md`](./spec/04-domains.md) — the domains we can serve and how each becomes a pack.
5. [`spec/05-detailed-architecture.md`](./spec/05-detailed-architecture.md) — the deep dive: capability
   services, the signal model, orchestration modes, data flow, contracts.
6. [`spec/06-build-phases.md`](./spec/06-build-phases.md) — how we build it, in phases.

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
