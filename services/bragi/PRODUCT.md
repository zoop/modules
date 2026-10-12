# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are the people inside an Indian insurer who handle a claim:

- **Claims desk** — needs a faster first look; wants small own-damage claims to arrive as a report (damaged parts + severity) instead of a folder of photos.
- **Special investigation (SIU)** — needs each fraud flag to carry the evidence behind it, so they open a file already knowing where to look.
- **Underwriting** — runs break-in / lapsed-policy inspections remotely from the customer's phone, with identity checked against Vahan.

Secondary buyers/users: digital & claims teams, TPAs, surveyors, and developers integrating via API. Context is India-native (Hindi & English).

## Product Purpose

Turn the raw material of a motor claim — vehicle photos, video, and claim documents — into an actionable read: a damage report, a fraud score, and the specific red flags behind it, each with a reason. The engine never approves or rejects; it tells the team where to look. Success = clean claims settle sooner (straight-through), suspect claims reach investigators evidence-first, and leakage is caught before the payout rather than after.

## Positioning

- **Explainable by design.** Every flag carries the exact figures it was based on — a decision a human can defend, not a black-box score.
- **Composable modules, one engine, every line.** Capabilities are built once and reused across insurance lines (motor today, health next). Buy one module, a bundled engine, or the whole stack.
- **India-native.** Hindi & English; identity matched against Vahan and registries.
- **Not demo-gated.** Transparent self-serve usage pricing in a category that hides behind "request a demo."
- **Two-tier, equal priority:** self-serve (digital/claims teams, TPAs, surveyors, developers) and enterprise (carriers running claims at scale) are both primary — the self-serve tier is a real product, not just an on-ramp.

## Operating Context

- Evidence arrives from the customer or the garage via a guided capture link (SMS / WhatsApp / email), or staff upload from the dashboard, or systems send by API.
- Output lands two ways: a PDF report in the dashboard and a JSON response (plus webhook) into the insurer's systems. Flagged files route to investigators with reasons attached.
- Consent is shown first and recorded with the case.

## Capabilities and Constraints

Six modules on one engine:

1. **Capture** — collect documents & images across channels (guided link, SMS, WhatsApp, email, or API).
2. **Document Intelligence** — extract fields from claim documents (policies, estimates, invoices, RCs, FIRs).
3. **Verification** — tampering checks + cross-source matching against Vahan and registries.
4. **Image Intelligence** — damaged parts & severity for motor; medical images & bills for health.
5. **Fraud** — one risk score over documents and images, with the reason behind every flag.
6. **Agentic Settlement** — orchestration agent running the claim end to end. **Roadmap, not shipped.**

Technical surface: REST API + webhooks. Accepts any mix of image/video/document (PDF/JPG/PNG); the response only contains sections matching what was sent. Sandbox keys for testing. Health line is planned ("motor today, health next"), not yet live.

## Brand Commitments

- **Name "Modules" is provisional** — a working name, explicitly flagged as placeholder. Do not harden brand/voice around it; it may be replaced.
- Codename for this website is **Bragi**. Package `@modules/bragi`; shared brand tokens/assets live in `@modules/brand` and repo-root `assets/`.
- **Voice:** plain, restrained, evidence-first. Short declaratives ("Read the photos. Read the paperwork. Know what to check."). No hype, no black-box claims; the human always decides.

## Evidence on Hand

- **No named customers, logos, or testimonials.** Proof is anonymous only — "design-partner insurers" / "design-partner pilots." Future work must not invent named customers, quotes, or logos.
- **Market context (not product metrics), with real sources:** combined motor+health gross premium ~₹2.26L cr (FY25); ~10% of premium lost to fraud/yr; ~70% of that fraud rides on document falsification; physical survey days → digital inspection minutes. Sources: IRDAI 2024-25, Insurance Institute of India, Deloitte India Insurance Fraud Survey 2023. Always label as industry estimates, never as product results.
- All on-page claim data (fraud scores, flags, API payloads, the demo form) is **sample / mock** — the form is not connected.

## Product Principles

1. **The engine informs; the human decides.** Never auto-approve or auto-reject.
2. **Every flag earns its place with evidence** — show what was compared and the figures behind it.
3. **Build a capability once, reuse it down every line** — composability over point tools.
4. **Clean claims go fast, suspect claims go to people** — straight-through for the clean, investigator-ready for the rest.
5. **Honest proof only** — market context stays labeled as context; nothing fabricated as a product result.

## Accessibility & Inclusion

Hindi & English are a product requirement (India-native). Consent is surfaced before capture and recorded with the case.
