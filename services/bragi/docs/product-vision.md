# Claims Intelligence — Product Vision & Context

> Canonical product context for what we are building and why. Kept in `bragi`
> (the website service) because the site is the first surface that must tell this
> story. Source of truth for product framing; update this as the thesis evolves.
>
> **Status:** draft · captured 2026-10-03 · owner: Product
> **Product brand:** TBD — working name "Claims Intelligence." This is a
> **vendor-agnostic product** (stands on its own brand; not tied to any parent).
> **Linear project:** P-CLMAF-299

## The thesis (one line)

**One claims-intelligence stack. Every insurance line. Built once, sold many times.**

We are not building a motor product. We are building the reusable capabilities a
claim needs, then pointing them at one insurance line after another. The **Motor
Fraud Engine is the first composition** of these capabilities. Health is the same
stack, reconfigured.

## The model: capabilities × lines

Two axes.

**Horizontal — the capability modules (reused across every line):**

1. **Capture** — collect documents & images from the customer across channels
   (link, SMS, WhatsApp, email, dashboard, API).
2. **Document Intelligence** — extract the useful information from any document.
3. **Verification** — prove documents are real and consistent (tampering,
   cross-source checks like Vahan).
4. **Image Intelligence** — domain vision (motor = damage; health = scans /
   medical bills / injury photos).
5. **Fraud** — one risk score over the documents + images, with the reasons.
6. **Agentic Settlement** — the agent that orchestrates all of the above to run
   the claim end to end. The north star and the moat.

**Vertical — the insurance lines we apply them to:** Motor (Phase 1) → Health
(next) → more lines. Each line reconfigures the same modules with its own document
types, vision model, and rules.

### The grid (build a row once, reuse it down every column)

| Module | Motor (Phase 1) | Health (next) | More lines |
|---|---|---|---|
| **Capture** | Guided vehicle photo & video tour | Bills, discharge summary, scans | same intake, new doc set |
| **Document Intelligence** | RC, policy, FIR, garage estimate | Hospital bills, lab reports, Rx | line-specific documents |
| **Verification** | Plate & chassis vs Vahan | Hospital/doctor registry, bill authenticity | registry & source checks |
| **Image Intelligence** | Damage detection & severity | Scans, bill images, injury photos | domain vision model |
| **Fraud** | Staged loss, inflated estimate | Upcoding, phantom billing, identity | line-specific rules |
| **Agentic Settlement** | Orchestrates the above → recommendation | Same agent, health rules | same agent, new rulebook |

"Motor Fraud Engine" = a few of these rows, one column.

## How a claim moves through the stack

**Capture → Understand → Verify → Score → Settle.** Same pipeline for every line;
only the models and rules in the middle change.

1. **Capture** — collect docs & images from the customer, any channel.
2. **Understand** — Document Intelligence + Image Intelligence read what came in.
3. **Verify** — real & consistent vs trusted sources.
4. **Score** — one fraud score, with the reasons behind it.
5. **Settle** — the agent orchestrates it into a recommendation.

**The human still decides.** Through Phase 1 the stack recommends and explains; it
never auto-approves or rejects. Agentic settlement raises how much it does on its
own, line by line, as trust is earned.

## How we package & sell it

Same code, three price points, three stories. **Sell the outcome, build the
capability, expose both** — specificity sells, generality scales.

| Tier | What | Buyer | Examples |
|---|---|---|---|
| **1 · Land** | Module APIs | developers / digital teams | Document Intelligence API, Capture API, Verification API |
| **2 · Expand** | Vertical Engines | claims & investigation teams | Motor Fraud Engine *(today)*, Health Claims Engine *(next)* |
| **3 · Own the claim** | Agentic Settlement | claims leadership / COO | straight-through for clean claims, investigator-ready for the rest |

### Why it compounds

- **~80% reused per new line** — a new line is mostly configuration (new doc set,
  vision model, rulebook) on the same stack.
- **Every module lifts every line** — improve Document Intelligence once and Motor,
  Health, and every future line get better at the same time.
- **The agent is the compounding moat** — more lines and more claims make the
  settlement agent smarter; that's the hard thing to copy.

## Product analysis (honest read)

**Strong:**
- The wedge is real: fraud lives in the *mismatch* between photos and paperwork;
  reading both is the right unit of analysis.
- India-native (Vahan, Indian docs, Hindi/English capture) is a defensible gap vs
  global (Tractable/Shift) and local KYC players (Signzy/IDfy).
- "The engine never decides" is the right legal/trust posture for Indian insurance.
- Configurable output (docs-only / photos-only / both) lowers adoption barrier.

**Risks / to validate:**
- **Phase 1 defers the core insight** — photo-vs-document cross-check is Phase 2, so
  Phase 1 sells "one vendor, one report, India-native," not yet the mismatch magic.
- **The fraud score is the product and is unsigned-off** — its credibility to a
  skeptical investigator is the #1 thing to prove.
- **"No competitor does both" is ambiguous** — could be a gap, or evidence insurers
  prefer best-of-breed. Validate demand shape with design-partner insurers.
- **Buyer vs user spread** — four user teams at once risks a thin product; pick a
  beachhead user and one claim type.
- **Design-partner insurer** — great for real files/feedback, but don't overfit;
  data-use rights gate how fast our own models improve.

## Mapping to this monorepo

This product decomposes cleanly into `modules`' "composable, sellable services"
pattern (one `services/<norse-name>/` per surface/capability). `bragi` is the public
website — **surface #1, already scaffolded** — and the public-site design mock is its
content. Service decomposition and Norse naming are an engineering discussion for
later; this doc is product framing only.

## Source material

- PM doc — **Motor Fraud Engine** (Draft v0.3, 30 Sep 2026): the Phase-1 spec
  (six surfaces + one engine, capture, dashboard, API, sample report, competitors,
  scope, open questions).
- PM doc — **Motor Engine Website**: the public-site design mock bragi builds from.
- Visual one-pager: [`product-vision.html`](./product-vision.html) — the grid, the
  flow, and the packaging ladder (investor framing, navy/teal/amber).

## Open questions (from the PM, still live)

How the fraud score is built & banded · which vendor damage model to launch on ·
GST source for invoice checks · data retention · data-use rights for model training ·
dashboard roles / SSO · two-wheelers in Phase 1 · pricing model (per case / per
input / annual) · **the product brand/name**.
