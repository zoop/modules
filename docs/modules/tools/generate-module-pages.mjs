import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';


const base = dirname(fileURLToPath(import.meta.url)) + '/../pages';

const modules = [
  {
    slug: 'capture', name: 'Capture', tag: 'Module 01 · the front door',
    promise: 'Evidence from anyone, anywhere — no app, no surveyor.',
    story: `Priya has just dented her car. She is standing next to it, upset, with exactly one tool in her hand: her phone. Everything Mimir will ever know about this claim begins in the next three minutes — which is why Capture is the module we obsess over first. If the evidence is bad, every clever model downstream is clever about garbage.`,
    build: [
      ['Multi-channel delivery', 'One capture request, many doors: a link by SMS, WhatsApp or email; an upload from the dashboard; or a straight API call from the client’s own app. The channel is pack/tenant config, not code.'],
      ['Guided capture scripts', 'The pack scripts the session: which angles, which documents, in what order. Priya sees an outline to line her bumper up with — step 3 of 8, left side, hold steady. Scripts are versioned config, so a fleet pack can ask a completely different set of questions.'],
      ['Capture-quality models', 'Real-time, on-device-cheap checks before submit: blur, glare, darkness, partial coverage, unreadable pages. A bad shot is rejected in the moment — when the re-take costs Priya five seconds, not a day of back-and-forth.'],
      ['Consent, first and recorded', 'Consent copy (pack-supplied, Hindi & English) is shown before anything is collected, and stored with the case as part of the audit trail.'],
      ['Sessions as first-class objects', 'Every capture is an ordered session on the case. A fleet client captures at handover and again at return — the compare question ("what changed?") needs sessions to be real objects, not loose files.'],
      ['Time-boxed, resumable links', 'Links expire; sessions survive a dropped connection. A claimant on a patchy network must never lose their work.'],
    ],
    contract: 'In: a capture request (who, what script, which channel). Out: validated artifacts in the Evidence Store + a consent record + <code>captured</code> signals on the case. Sold per capture session.',
    pack: 'Capture script (angles, documents, order) · quality thresholds · consent copy · languages · link lifetime.',
    eng: [
      '<code>POST /v1/cases/{id}/capture-link</code> issues a signed, expiring token; the capture web app is a static PWA talking to File Ingest via presigned URLs — no files transit our API servers.',
      'Quality gates run client-side first (cheap heuristics in WASM/JS), server-side second (authoritative) — the server never trusts the client verdict.',
      'Sessions are append-only sub-streams of the case event log; a resumed session replays its state from events, so a dropped connection costs nothing.',
      'Failure modes to design for: expired link mid-session (re-issue, keep session), duplicate submissions (idempotency key per artifact), oversized video (chunked upload + server-side transcode).',
    ],
    open: [
      'Channel order: launch with SMS + WhatsApp, or is email enough for pilot insurers?',
      'Quality models: build thin (blur/glare heuristics) or license a capture SDK for v1?',
      'Video: require the short walkaround from day one, or photos-only for the first pack?',
      'Offline / low-bandwidth mode: how much do we invest for Tier-2/3 India at Phase 1?',
    ],
  },
  {
    slug: 'extract', name: 'Extract', tag: 'Module 02 · reading the paperwork',
    promise: 'Any document in, typed fields out — with a pointer to where each fact came from.',
    story: `Priya uploaded four documents: her RC, the policy, the garage estimate, the invoice. To a human reviewer that’s twenty minutes of squinting. Extract’s job is to make the paperwork machine-readable in seconds — not by "understanding documents" in the abstract, but by answering exactly the questions the pack’s schema asks.`,
    build: [
      ['Schema-driven extraction', 'The pack defines document schemas — the entities and fields that matter (policy number, dates, line items, amounts). Extract returns only what the schema asks for. A health pack asks different questions of different documents; the engine does not change.'],
      ['Model bindings via the gateway', 'OCR and vision-language models are commodities we route to through the Model Gateway — swappable, versioned, benchmarked per pack. We do not marry a vendor.'],
      ['Confidence + provenance per field', 'Every extracted field carries a confidence score and a source span — the exact region of the page it came from. Provenance is what makes a downstream fraud flag defensible.'],
      ['Structured-table handling', 'Estimates and invoices are line-item tables; totals must reconcile with their rows. Table extraction is a first-class capability, not an afterthought — one of our moat checks ("estimate total differs from its line items") depends on it.'],
      ['Correction loop', 'When a human fixes a field in the Review Console, the correction is stored as a label against that document type and model version. Extraction accuracy is designed to be measured and published per pack (Phase 2+).'],
    ],
    contract: 'In: documents (PDF/JPG/PNG). Out: typed field signals with confidence + source spans. Sync for one document, async for batches. Sold per document or page.',
    pack: 'Document schemas · model/prompt bindings · language handling · field validation rules.',
    eng: [
      'Schemas are JSON Schema-ish pack artifacts, versioned in the Pack Registry; an extraction result is invalid unless it validates against the schema version it claims.',
      'All model calls go through the Model Gateway with a per-pack binding (model, prompt, fallback chain); swapping vendors is a binding change plus an eval run, not a deploy.',
      'Source spans are stored as page + bounding-box against the content-addressed artifact — the Review Console renders corrections directly on the page image.',
      'Failure modes: low-confidence fields degrade to <code>needs_review</code> signals rather than guesses; table reconciliation mismatches emit their own signal (Detect feeds on it).',
    ],
    open: [
      'First document set: RC + policy + estimate + invoice — is FIR in or out for Phase 1?',
      'OCR vendor vs VLM-first: which is primary, which is fallback?',
      'Handwriting: how common is it in our pilot insurers’ paperwork, and do we defer it?',
      'Correction UX: who at the client corrects fields — their ops team or ours during pilots?',
    ],
  },
  {
    slug: 'vision', name: 'Vision', tag: 'Module 03 · reading the images',
    promise: 'Photos and video become findings — in the vocabulary the pack defines.',
    story: `Priya’s eight photos and walkaround video show a dented front bumper, a scratched fender, and — importantly — a completely intact rear. Vision turns pixels into findings: part, damage type, severity, region on the image. But here is the discipline that keeps Mimir generic: Vision does not know what a "bumper" is. The motor pack taught it.`,
    build: [
      ['Pack-defined feature schemas', 'Vision returns features in the schema the pack supplies — parts/damage/severity for motor, condition grades for fleet, something else entirely for the next domain. "Damage" never appears in engine code. This is the R4 guard in practice.'],
      ['Detection + severity models', 'Damage detection is commoditising — we integrate and benchmark models through the gateway rather than claiming detection accuracy as our pitch. Our work is the harness: consistent features, calibrated severity, evidence regions on the image.'],
      ['Video as frames with intent', 'The walkaround video is sampled against the capture script — do we have all eight angles, does the plate appear, is the lighting usable? Video backs up photos; it does not replace structure.'],
      ['Compare mode (before/after)', 'Two sessions in, a diff out: what changed between handover and return? This one operation turns a claims tool into a fleet, rental, warranty and logistics tool — the cohort multiplier.'],
      ['Identity cues for Verify', 'Plate and chassis read from the images become signals that Verify cross-checks against the registry. Vision reads; Verify proves.'],
    ],
    contract: 'In: images/video (or two sessions for compare). Out: feature signals — regions, classes, scores — per the pack’s schema. Sold per inspection or comparison.',
    pack: 'Feature schema · vision model bindings · severity calibration · capture-script linkage.',
    eng: [
      'Vision emits <code>feature</code> signals whose value shape is the pack schema — engine code treats them as opaque typed payloads. A CI lint fails any engine source that names a domain feature (the R4 guard, mechanised).',
      'GPU-heavy inference runs on its own queue with batch-friendly workers; compare mode is a pure function over two sessions’ stored features — no re-inference when both sides are already processed.',
      'Video pipeline: sample frames keyed to capture-script steps, dedupe near-identical frames, run the same feature models — video adds coverage, not a second model stack.',
      'Failure modes: partial angle coverage emits a <code>coverage_gap</code> signal (Decide can route on it); model-version drift is pinned per case so a re-run is reproducible.',
    ],
    open: [
      'Build vs license the motor damage model for Phase 1 — and which do we benchmark against?',
      'Part taxonomy: adopt an industry standard or define our own (and map at the edges)?',
      'Severity calibration: who signs off that "moderate" means the same thing across insurers?',
      'Compare mode: Phase 2 as planned, or does a fleet design partner pull it into Phase 1?',
    ],
  },
  {
    slug: 'verify', name: 'Verify', tag: 'Module 04 · proving it’s real',
    promise: 'Claims about identity checked against sources of truth — not taken from the form.',
    story: `The estimate says the car is a 2022 hatchback owned by Priya. The photos show a plate. The RC shows a chassis number. Verify’s job is to stop trusting the paperwork and start checking it: plate against Vahan, owner against the RC, PAN against the tax registry. Most fraud doesn’t survive a cross-check — if the cross-check actually happens.`,
    build: [
      ['The connector interface', 'Sources of truth plug in as connectors — Vahan, DL, PAN, GST for motor; different registries for other domains. Async, cached, rate-limited, and fail-soft: a registry being down degrades the report honestly instead of blocking the case.'],
      ['Cross-source matching', 'Entities extracted from documents and images are matched across sources, and every match/mismatch is a signal carrying the exact figures compared — "plate in photo: MH12AB1234; RC: MH12AB1234; Vahan: match."'],
      ['Caching & staleness policy', 'Registry answers are cached with explicit freshness windows per connector — fast and cheap on repeat lookups, and the report always says how fresh the answer is.'],
      ['Existing rails as the unfair advantage', 'Where the business already operates government-record APIs, they slot in as day-one connectors — already built, already sold. The platform makes them composable.'],
    ],
    contract: 'In: entities (from Extract/Vision). Out: verification signals — match/mismatch with the figures behind each. Sync for single lookups, async inside cases. Sold per verification or lookup.',
    pack: 'Which connectors count as truth · cross-check rules · freshness windows.',
    eng: [
      'Connector = a small adapter implementing one interface: <code>lookup(entity) → attested facts + freshness + source</code>. Circuit-breakered, cached (per-connector TTL), rate-limit aware.',
      'Registry outage degrades to a <code>source_unavailable</code> signal with the cache age — the case proceeds and the report says exactly what could not be checked.',
      'Match semantics are rule-config (exact / normalized / fuzzy-with-threshold) per field per pack — the matcher is generic, the policy is pack.',
      'Failure modes: stale cache served past TTL is marked stale, never silent; conflicting sources (RC vs registry) emit a conflict signal rather than picking a winner in engine code.',
    ],
    open: [
      'Connector SLAs: what do we promise when Vahan is slow or down — degrade, retry, or hold?',
      'What legally counts as a "match" — exact string, fuzzy, or registry-confirmed?',
      'Which connectors are Phase 1 (RC/Vahan certain) vs Phase 2 (bank, bureau)?',
      'Pricing: per lookup pass-through plus margin, or bundled into the case price?',
    ],
  },
  {
    slug: 'detect', name: 'Detect', tag: 'Module 05 · the fraud engine',
    promise: 'One risk read over everything — images, documents, records — with a reason for every flag.',
    story: `Here is where Priya’s claim gets interesting. The garage estimate lists a brand-new bumper. Her photos show a dent — but no bumper damage at all. Neither the document reader nor the image model can catch that alone. Detect reads the whole signal set — what Extract read, what Vision saw, what Verify proved — and catches the story that doesn’t add up. That fused view is the moat.`,
    build: [
      ['Rules over the signal set', 'Risk rules are pack-supplied config, evaluated over typed signals — never hardcoded. The same engine scores motor claims, invoices, and KYC files, because it only ever speaks signals.'],
      ['Three modes, one module', 'Images alone (manipulation, AI-generation, re-digitisation, reuse), documents alone (mismatches, tampering, inflation), or both fused. Clients buy the mode they need; the fused mode is what nobody else sells.'],
      ['Image forensics', 'Tamper and AI-generation detection on photos — integrated models behind the gateway, with our calibration and our evidence format on top.'],
      ['A score that explains itself', 'Out comes a score and a band — but every flag beneath it carries what was compared and the exact figures. "78, high" is useless in a dispute; "estimate lists front bumper replacement; photos show no front-bumper damage" is defensible.'],
      ['Cross-case signals (Phase 3)', 'The same payee across twelve claims, the same photo in three. Ring detection needs the Entity/Link Graph — deliberately deferred until a product demands it and legal clears it.'],
    ],
    contract: 'In: the case’s signals (any subset). Out: pass/fail checks + a scored, banded risk signal with reasons. Sold per case scored.',
    pack: 'Rule set + weights · bands/thresholds vocabulary · which checks are enabled per mode.',
    eng: [
      'Rules are declarative expressions over the typed signal set (think: a constrained predicate language, versioned in the Pack Registry) — evaluated by a generic evaluator, never compiled into engine code.',
      'A check’s output is itself a signal: <code>{check, verdict, inputs: [signal refs + figures], weight}</code> — the "reason" is the actual evidence chain, not a generated sentence.',
      'Fused checks are just rules that reference signals from multiple producers (Vision + Extract + Verify) — no special fusion machinery; R2 makes the moat a one-liner.',
      'Failure modes: missing inputs make a check <code>not_evaluable</code> (reported, never guessed); rule-version is pinned per case so disputed scores replay exactly.',
    ],
    open: [
      'Rules engine: adopt one (and which), or write a minimal evaluator over signals?',
      'The rules/ML mix for v1: start rules-heavy and earn ML with labels, or seed with models?',
      'Who authors and signs off pack rules — us, the insurer, or co-owned during pilots?',
      'Flag format: is our evidence structure enough for an IRDAI-defensible audit trail?',
    ],
  },
  {
    slug: 'estimate', name: 'Estimate', tag: 'Module 06 · what it should cost',
    promise: 'From detected features to a priced, reproducible line-item estimate.',
    story: `The garage wants ₹43,000. Vision found a moderately dented bumper and a scratched fender. What should the repair actually cost? Estimate maps features to parts and labour against licensed, versioned price data — so when the insurer disputes an inflated invoice, the counter-estimate is reproducible down to the catalog version it was priced with.`,
    build: [
      ['Feature → line-item mapping', 'Pack config maps Vision’s features (part × damage × severity) to repair operations and parts. The mapping is data, reviewable by a domain expert, not buried in code.'],
      ['The Reference-Data plane', 'Parts catalogs, labour rates, procedure prices — licensed, versioned, regional. Distinct from identity sources: Verify asks "is this real?", Estimate asks "what is this worth?"'],
      ['Repair-vs-replace logic', 'Threshold rules (pack-supplied) decide repair vs replace per part — a severity-and-economics call, surfaced with its reasoning like every other signal.'],
      ['Reproducibility', 'Every estimate pins the reference-data version it priced against. Re-run the case next quarter and you can explain every rupee of difference.'],
      ['Inflation checks feed Detect', 'The gap between our estimate and the garage’s invoice is itself a signal — Detect turns it into the "invoice inflation" flag with the figures attached.'],
    ],
    contract: 'In: feature signals + a reference-data binding. Out: costed line items + repair/replace calls, versioned. Sold per estimate.',
    pack: 'Reference-data binding (catalog, rates, region) · mapping tables · repair-vs-replace thresholds.',
    eng: [
      'Reference data is immutable-versioned (catalog@version, rates@version); an estimate signal pins both, so re-pricing is a pure, reproducible function.',
      'Mapping tables (feature → operations/parts) live in the Pack Registry as reviewable data — a domain expert can diff two mapping versions like code review.',
      'Unmapped features produce an <code>unpriced_item</code> line with a nearest-match suggestion, never a silent drop — the total always discloses its coverage.',
      'Failure modes: licensed-data outage falls back to the last cached version (flagged stale); currency/regional mismatches fail loudly at pack-validation time, not at runtime.',
    ],
    open: [
      'Which parts/labour data do we license first, and what does it cost per lookup?',
      'Regional variance: city-level labour rates in v1, or state-level and refine later?',
      'How do we handle parts not in the catalog — nearest match, manual, or skip with a note?',
      'Is Estimate in Phase 1 for the motor product, or Phase 2 as currently planned?',
    ],
  },
  {
    slug: 'decide', name: 'Decide', tag: 'Module 07 · the human stays in charge',
    promise: 'Clean cases clear automatically. Doubtful ones reach a human — with the reasons attached.',
    story: `Priya’s claim scored 78 — high. The policy lapsed before the loss, and the estimate doesn’t match the photos. Decide does not reject her claim. It routes the case to an investigator with every flag and figure attached, pauses durably — for hours or days — and records whatever the human decides. The engine informs; the human owns the call. That principle is engineered, not just stated.`,
    build: [
      ['Threshold policy engine', 'Pack-supplied thresholds over the risk and estimate signals: auto-clear below, route above, with per-client overrides. Clean claims settle without a human touch — that’s the speed promise.'],
      ['Hard caps, enforced', 'Legal and client-set limits above which nothing auto-clears, ever — enforced in the engine, not left to configuration discipline. The IRDAI sub-₹50k context is a pack setting; the cap mechanism is platform.'],
      ['Durable human-in-the-loop', 'A routed case parks, durably, until the Review Console returns a decision — days later if needed. Webhooks fire on every transition so the client’s systems always know where the case stands.'],
      ['Decisions as audit objects', 'Every decision — automated or human — lands in the event log with its inputs, thresholds, and model versions. Regulator-grade replay is a query, not an archaeology project.'],
      ['Corrections close the loop', 'When the investigator overturns a flag, that correction becomes a label. Decide is where the learning loop starts, not just where the case ends.'],
    ],
    contract: 'In: risk/estimate signals + thresholds. Out: a decision (clear / route) + flags, terminal case events, webhooks. Sold per automated decision.',
    pack: 'Thresholds · routing policy · hard caps · report template.',
    eng: [
      'Hard caps are enforced in the engine as invariants (a decision above cap without a human event is unrepresentable), not validated in pack config — config review is not a safety mechanism.',
      'Routed cases park as durable workflow timers/waits; the Review Console resolution is just another case event, so crash-recovery and audit come free from event sourcing.',
      'Every decision event embeds: threshold version, rule versions, model versions, input signal refs — regulator replay is <code>fold(events)</code>, no joins across mutable tables.',
      'Failure modes: webhook endpoint down → signed retries with backoff + a replay API; reviewer SLA breach emits an escalation event the client can route on.',
    ],
    open: [
      'Who tunes thresholds in a pilot — us, the insurer’s claims head, or jointly with a dashboard?',
      'Review Console v1: build minimal in-house, or is the insurer’s existing queue the UI?',
      'What is the SLA story for a case parked on human review — ours or the client’s?',
      'Appeal path: when a claimant disputes, what does the case replay owe them (DPDP)?',
    ],
  },
];

const css = `
  :root{
    --bg:#f6f5f1; --panel:#fff; --ink:#191919; --muted:#70706a; --line:#e4e1d8;
    --platform:#1f6feb; --platform-soft:#e9f0fe; --pack:#b4530a; --pack-soft:#fcefe2;
    --cross:#5a4fcf; --cross-soft:#ecebfb; --shadow:0 1px 3px rgba(0,0,0,.07);
  }
  @media(prefers-color-scheme:dark){:root{
    --bg:#0e1014; --panel:#161922; --ink:#e8eaef; --muted:#97a0ae; --line:#272c38;
    --platform:#6aa2ff; --platform-soft:#182238; --pack:#f0a062; --pack-soft:#2c2013;
    --cross:#a79cff; --cross-soft:#1f1c33; --shadow:0 1px 3px rgba(0,0,0,.4);}}
  [data-t="light"]{--bg:#f6f5f1;--panel:#fff;--ink:#191919;--muted:#70706a;--line:#e4e1d8;--platform:#1f6feb;--platform-soft:#e9f0fe;--pack:#b4530a;--pack-soft:#fcefe2;--cross:#5a4fcf;--cross-soft:#ecebfb;--shadow:0 1px 3px rgba(0,0,0,.07)}
  [data-t="dark"]{--bg:#0e1014;--panel:#161922;--ink:#e8eaef;--muted:#97a0ae;--line:#272c38;--platform:#6aa2ff;--platform-soft:#182238;--pack:#f0a062;--pack-soft:#2c2013;--cross:#a79cff;--cross-soft:#1f1c33;--shadow:0 1px 3px rgba(0,0,0,.4)}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:15.5px/1.6 ui-sans-serif,-apple-system,"Segoe UI",Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .page{max-width:880px;margin:0 auto;padding:40px 24px 80px}
  .topnav{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-size:13px}
  .topnav a{color:var(--muted);text-decoration:none}
  .topnav a:hover{color:var(--platform)}
  .theme{border:1px solid var(--line);background:var(--panel);color:var(--muted);border-radius:8px;padding:6px 11px;font-size:13px;cursor:pointer}
  .tagline{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--pack);font-weight:700;margin:14px 0 6px}
  h1{font-size:34px;letter-spacing:-.02em;margin:0 0 4px}
  h1 b{color:var(--platform)}
  .promise{font-size:18px;color:var(--muted);margin:0 0 22px;line-height:1.45}
  .story{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 22px;box-shadow:var(--shadow);font-size:15.5px;line-height:1.65;margin-bottom:30px}
  .story::before{content:"The story so far";display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--platform);font-weight:700;margin-bottom:8px}
  h2{font-size:19px;margin:30px 0 12px;letter-spacing:-.01em}
  .build{display:flex;flex-direction:column;gap:10px}
  .b{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:13px 17px;box-shadow:var(--shadow)}
  .b h3{margin:0 0 4px;font-size:15px;color:var(--platform)}
  .b p{margin:0;color:var(--ink);font-size:14px;line-height:1.55}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}
  @media(max-width:700px){.meta{grid-template-columns:1fr}}
  .mcard{border:1px solid var(--line);border-radius:12px;padding:13px 16px;font-size:13.5px;line-height:1.55}
  .mcard.contract{background:var(--platform-soft)}
  .mcard.packs{background:var(--pack-soft)}
  .mcard .k{font-size:11px;letter-spacing:.07em;text-transform:uppercase;font-weight:700;margin:0 0 6px}
  .mcard.contract .k{color:var(--platform)} .mcard.packs .k{color:var(--pack)}
  .engsec{margin-top:30px;border:1px solid var(--line);border-radius:14px;padding:16px 20px;background:var(--panel);box-shadow:var(--shadow)}
  .engsec h2{margin:0 0 10px;font-size:17px}
  .engsec h2 span{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-left:8px}
  .engsec ul{margin:0;padding-left:20px}
  .engsec li{margin:7px 0;font-size:14px;line-height:1.55}
  .open{background:var(--cross-soft);border:1px solid var(--line);border-radius:14px;padding:16px 20px;margin-top:30px}
  .open h2{margin:0 0 10px;color:var(--cross);font-size:17px}
  .open ol{margin:0;padding-left:20px}
  .open li{margin:7px 0;font-size:14.5px}
  .chapnav{display:flex;justify-content:space-between;gap:12px;margin-top:36px}
  .chapnav a{flex:1;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 16px;text-decoration:none;color:var(--ink);box-shadow:var(--shadow);font-size:14px}
  .chapnav a:hover{border-color:var(--platform)}
  .chapnav .dir{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
  .chapnav .next{text-align:right}
  .foot{margin-top:26px;color:var(--muted);font-size:12.5px;text-align:center}
  code{background:var(--platform-soft);padding:.1em .4em;border-radius:5px;font-size:.9em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
`;

const script = `
  document.getElementById('theme').addEventListener('click',()=>{
    const d=document.documentElement,c=d.getAttribute('data-t');
    d.setAttribute('data-t',c==='dark'?'light':c==='light'?'dark':(matchMedia('(prefers-color-scheme: dark)').matches?'light':'dark'));
  });
  const inFrame=window.self!==window.top;
  if(inFrame){const tb=document.getElementById('theme');if(tb)tb.style.display='none';document.body.style.background='transparent';const dh=document.getElementById('docsHome');if(dh)dh.style.display='none';}
  window.addEventListener('message',e=>{if(e.data&&e.data.type==='theme')document.documentElement.setAttribute('data-t',e.data.value);});
  function postSize(){if(inFrame){try{parent.postMessage({type:'size',height:document.body.scrollHeight},'*');}catch(_){}}}
  window.addEventListener('load',postSize);
  if(window.ResizeObserver)new ResizeObserver(postSize).observe(document.body);
`;

modules.forEach((m, i) => {
  const prev = modules[(i - 1 + modules.length) % modules.length];
  const next = modules[(i + 1) % modules.length];
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Mimir — ${m.name}</title>
<style>${css}</style>
</head>
<body>
<div class="page">
  <div class="topnav">
    <a id="docsHome" href="../index.html">← Mimir docs</a>
    <button class="theme" id="theme">◐ Theme</button>
  </div>
  <p class="tagline">${m.tag}</p>
  <h1><b>${m.name}</b></h1>
  <p class="promise">${m.promise}</p>

  <div class="story">${m.story}</div>

  <h2>What we're going to build</h2>
  <div class="build">
    ${m.build.map(([t, d]) => `<div class="b"><h3>${t}</h3><p>${d}</p></div>`).join('\n    ')}
  </div>

  <div class="meta">
    <div class="mcard contract"><p class="k">The contract (platform — never changes)</p>${m.contract}</div>
    <div class="mcard packs"><p class="k">What the pack supplies (per domain)</p>${m.pack}</div>
  </div>

  <div class="engsec">
    <h2>For engineers &amp; architects<span>implementation notes</span></h2>
    <ul>
      ${m.eng.map((e) => `<li>${e}</li>`).join('\n      ')}
    </ul>
  </div>

  <div class="open">
    <h2>Open questions — for the room</h2>
    <ol>
      ${m.open.map((q) => `<li>${q}</li>`).join('\n      ')}
    </ol>
  </div>

  <div class="chapnav">
    <a href="module-${prev.slug}.html"><span class="dir">← Previous</span>${prev.name}</a>
    <a class="next" href="module-${next.slug}.html"><span class="dir">Next →</span>${next.name}</a>
  </div>

  <p class="foot">Mimir · the Modules intelligence engine — module ${String(i + 1).padStart(2, '0')} of ${String(modules.length).padStart(2, '0')} · <a href="../index.html" style="color:var(--platform)">all docs</a></p>
</div>
<script>${script}</script>
</body>
</html>
`;
  writeFileSync(`${base}/module-${m.slug}.html`, html);
  console.log(`wrote module-${m.slug}.html`);
});
console.log('done: ' + modules.length + ' module pages');
