# Business Storyline — Modules (working name)

> The PM + business narrative: the problem, why now, the product, the two-tier
> model (self-serve SaaS + Enterprise), positioning, pricing shape, and go-to-market.
> Companion to [product-vision.md](./product-vision.md) and [brand.md](./brand.md).
> Vendor-neutral. Market name "Modules" is a placeholder (final brand TBD).
>
> Captured 2026-10-03 · figures sourced below; ranges are estimates, not audited.

## One-liner

**The claims-intelligence layer for insurers: read the photos, read the paperwork,
score the fraud, and (soon) settle the claim — explainably. Built once as modules,
reused across every insurance line.**

## The problem

Insurers bleed money and time in claims, and the leak is concentrated exactly where
software can help:

- **~₹2.26 lakh crore** combined motor + health gross premium in India (FY25:
  motor ₹99,093 cr, health ₹1,27,417 cr). [IRDAI 2024-25; IBEF]
- **~10% lost to fraud (~₹45,000 cr/yr), and ~70% of it rides on document
  falsification** — forged estimates, tampered invoices, mismatched policy dates.
  [Insurance Institute of India; Deloitte India Fraud Survey 2023]
- **60% of insurers report a significant rise in fraud**, driven by digitisation and
  weaker remote controls. [Deloitte 2023]
- Manual review can't scale: **3.26 crore health claims settled in FY25**, under new
  sub-hour cashless SLAs.

Document fraud is the bullseye — and it's exactly what the stack reads.

## Why now

The regulator just made automation both **necessary** and **allowed**, simultaneously:

- **Surveyor requirement removed for motor losses < ₹50,000** — explicitly enabling
  app/AI assessment. [IRDAI / Finance Ministry]
- **Cashless health SLAs: pre-auth ≤ 1 hour, final ≤ 3 hours** — manual review is
  untenable at scale. [IRDAI Master Circular on health, 2024]
- **IRDAI named claims + fraud detection its #1 AI-governance priority**, pushing
  *explainable, auditable* AI — which is exactly our "every flag has a reason, the
  human decides" posture. [IRDAI AI Working Group, 2026 — verify]
- **Insurer AI adoption jumped 8% → 34% (2024→2025)** — past pilots, into core ops.

"Why now" in one line: **the regulator removed the manual gate, imposed clocks that
force automation, and blessed explainable AI — on a ₹2.26L-cr base losing ~10% to
document-heavy fraud.**

## The product (recap)

Six reusable **modules** — Capture, Document Intelligence, Verification, Image
Intelligence, Fraud, and Agentic Settlement — composed into **vertical engines** per
insurance line (Motor now, Health next). The engine never auto-decides in Phase 1;
it recommends and explains. See [product-vision.md](./product-vision.md) for the
capability × line grid and the claim flow.

## The two-tier model

Same stack, two ways to buy — and publishing the self-serve tier at all is itself a
differentiator (≈15 of 18 competitors are enterprise-only, no public pricing).

| | **Modules** (self-serve SaaS) | **Modules Enterprise** |
|---|---|---|
| **Who** | digital/claims teams at mid-tier insurers, TPAs, surveyor firms, developers | large insurers / carriers, group deployments |
| **What** | sign up, get sandbox keys, call the module APIs or use the dashboard; capture links, reports | everything in SaaS + integration to claim systems, SSO, roles, white-label, data residency, custom rules, SLAs |
| **Deploy** | multi-tenant cloud | dedicated / VPC / on-prem options, managed onboarding |
| **Pricing shape** | usage-based: per case / per inspection / per document, transparent, free trial | annual platform fee + usage + integration; pilot → rollout |
| **Support** | docs, email, community | named CSM, solution engineering, design-partner pilots |
| **Buyer** | practitioner / developer (bottoms-up) | claims leadership / COO (top-down) |

Naming follows the research: **one master brand + a tier word** (`Modules` /
`Modules Enterprise`) — concentrates SEO + trademark on one name instead of splitting
it. (Tier word could become `Core`; TBD with the final brand.)

## Positioning & differentiation

1. **Both sides of the claim, one report.** Competitors read photos *or* documents;
   we read both and (Phase 2) cross-check them — fraud lives in the mismatch.
2. **India-native.** Vahan, Indian motor/health documents, Hindi + English capture.
3. **Explainable, human-in-the-loop.** Every flag carries its reason; the engine
   never approves/rejects in Phase 1. Aligned with IRDAI's explainable-AI stance.
4. **Transparent self-serve tier.** Published pricing + sandbox vs the category's
   demo-gated norm — lowers the barrier and lands practitioners/developers.
5. **A brand that doesn't look like insurtech.** Teal + amber, a real symbol, warm —
   against a wall of navy wordmarks.

## Go-to-market motion

**Land → Expand → Own the claim.**

1. **Land** — a single module (Document Intelligence API or Capture) or the
   self-serve SaaS, usage-priced. Low friction, proves value fast.
2. **Expand** — the **Motor Fraud Engine** vertical bundle (report + dashboard),
   sold as an outcome to claims/investigation teams.
3. **Own the claim** — **Agentic Settlement**, sold to claims leadership; straight-
   through for clean claims, investigator-ready for the rest.

- **Beachhead:** the **investigation team** on **small motor own-damage** claims —
  the clearest pain, the newly-deregulated < ₹50k zone, fastest proof.
- **First clients:** existing design-partner insurer(s) for real files + feedback;
  then mid-tier insurers and TPAs.
- **Second line:** Health, reusing ~80% of the stack.

## Pricing shape (directional)

- **SaaS:** free trial (e.g. first N cases), then per-case / per-inspection /
  per-document; tiered volume discounts. Transparent on the site.
- **Enterprise:** annual platform fee + committed usage + one-time integration;
  pilot priced separately. Value-based where agentic settlement reduces cost-per-claim.

## Roadmap (business view)

| Phase | What changes commercially |
|---|---|
| **1 — now** | Motor: capture + doc/image + fraud score + report. SaaS + Enterprise live. |
| **2** | Photo-vs-document **cross-check** — the headline differentiator turns on. |
| **3** | Call recordings as a third input. |
| **4** | Cross-insurer intelligence (repeat claimants) with an industry bureau. |
| **Line 2** | **Health** engine on the same stack. |

## Business case anchors

- Addressable leakage: ~10% of ₹2.26L-cr GWP ≈ **₹20,000–45,000 cr/yr** recoverable
  pool; even 1–2% recovery is a large TAM.
- Speed: physical survey → AI inspection = **days → minutes**.
- Focus: **~70% of fraud is document-based** — directly in scope.

## Risks & open questions

- **Fraud-score credibility** is the #1 thing to prove (it's the headline number).
- **Phase 1 defers the cross-check** — be honest that the core moat is Phase 2.
- **Demand shape** — validate that insurers want *combined* vs best-of-breed.
- Data-use rights for model training; retention/DPDP consent; dashboard roles/SSO;
  two-wheelers in Phase 1; final pricing unit; **the product name/brand**.

## Sources

IRDAI Annual Report 2024-25 · IBEF health premium FY25 · Insurance Institute of India
(fraud ~₹45,000 cr) · Deloitte India Insurance Fraud Survey 2023 · IRDAI Master
Circular on health insurance 2024 (cashless SLAs) · Finance Ministry/IRDAI (surveyor
waiver < ₹50k) · IRDAI AI Working Group 2026 (verify) · industry press on AI adoption.
Ranges (fraud 7–15%) are estimates/press, not IRDAI-audited.
